-- ==============================================================================
-- SERMOA FIT / AGENDAFIT - MERCADO PAGO & CREDIT LEDGER SCHEMA
-- ==============================================================================

-- 1. TABLA: pack_purchases (Registro de compras de packs y pagos)
CREATE TABLE IF NOT EXISTS pack_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    pack_id UUID REFERENCES credit_packs(id) ON DELETE RESTRICT,
    credits INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'cancelled', 'rejected'
    mp_preference_id TEXT,
    mp_payment_id TEXT,
    external_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_pack_purchases_user ON pack_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_pack_purchases_status ON pack_purchases(status);
CREATE INDEX IF NOT EXISTS idx_pack_purchases_pref ON pack_purchases(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_pack_purchases_ext_ref ON pack_purchases(external_reference);

-- 2. TABLA: credit_ledger (Libro mayor de movimientos de créditos)
CREATE TABLE IF NOT EXISTS credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES pack_purchases(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    delta INT NOT NULL, -- (+8 por compra, -1 por asistencia/reserva, etc.)
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_purchase ON credit_ledger(purchase_id);

-- 3. TRIGGER: Recalcular y mantener actualizado profiles.credits_balance
CREATE OR REPLACE FUNCTION fn_update_profile_credits_balance()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_total_credits INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_user_id := OLD.user_id;
    ELSE
        v_user_id := NEW.user_id;
    END IF;

    -- Calcular la suma total de deltas para este usuario
    SELECT COALESCE(SUM(delta), 0)
    INTO v_total_credits
    FROM credit_ledger
    WHERE user_id = v_user_id;

    -- Actualizar el saldo acumulado en profiles
    UPDATE profiles
    SET credits_balance = GREATEST(0, v_total_credits),
        updated_at = NOW()
    WHERE id = v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_credit_ledger_balance ON credit_ledger;
CREATE TRIGGER trg_credit_ledger_balance
AFTER INSERT OR UPDATE OR DELETE ON credit_ledger
FOR EACH ROW
EXECUTE FUNCTION fn_update_profile_credits_balance();

-- 4. FUNCIÓN SEGURA (RPC): Acreditar compra con Idempotencia absoluta
CREATE OR REPLACE FUNCTION accredit_pack_purchase(
    p_purchase_id UUID,
    p_mp_payment_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_purchase pack_purchases%ROWTYPE;
BEGIN
    -- Bloqueo de fila (FOR UPDATE) para prevenir doble acreditación concurrente
    SELECT * INTO v_purchase
    FROM pack_purchases
    WHERE id = p_purchase_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Compra no encontrada con ID %', p_purchase_id;
    END IF;

    -- Si ya fue acreditada previamente, respondemos OK sin duplicar
    IF v_purchase.status = 'paid' THEN
        RETURN TRUE;
    END IF;

    -- A) Marcar compra como pagada
    UPDATE pack_purchases
    SET status = 'paid',
        mp_payment_id = COALESCE(p_mp_payment_id, mp_payment_id),
        paid_at = NOW()
    WHERE id = p_purchase_id;

    -- B) Insertar movimiento en el libro mayor de créditos (+N)
    INSERT INTO credit_ledger (
        studio_id,
        user_id,
        purchase_id,
        delta,
        reason
    ) VALUES (
        v_purchase.studio_id,
        v_purchase.user_id,
        v_purchase.id,
        v_purchase.credits,
        'Compra Pack (' || v_purchase.credits || ' clases) - Mercado Pago'
    );

    -- C) Registrar ingreso en la tabla financiera contable (payments)
    INSERT INTO payments (
        studio_id,
        student_id,
        pack_id,
        amount,
        payment_type,
        payment_method,
        concept,
        status,
        reference_code
    ) VALUES (
        v_purchase.studio_id,
        v_purchase.user_id,
        v_purchase.pack_id,
        v_purchase.amount,
        'income',
        'mercadopago',
        'Pago Online Pack (' || v_purchase.credits || ' clases)',
        'completed',
        COALESCE(p_mp_payment_id, v_purchase.id::text)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. HABILITAR SUPABASE REALTIME (Para que el frontend detecte el pago instantáneamente)
ALTER PUBLICATION supabase_realtime ADD TABLE pack_purchases;

-- 6. POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
ALTER TABLE pack_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;

-- Admins: control total
CREATE POLICY "Admins full access on pack_purchases" ON pack_purchases
    FOR ALL USING (
        auth.uid() IN (
            SELECT auth_user_id FROM profiles WHERE role = 'admin' AND studio_id = pack_purchases.studio_id
        )
    );

CREATE POLICY "Admins full access on credit_ledger" ON credit_ledger
    FOR ALL USING (
        auth.uid() IN (
            SELECT auth_user_id FROM profiles WHERE role = 'admin' AND studio_id = credit_ledger.studio_id
        )
    );

-- Alumnos: ver exclusivamente sus compras y movimientos de crédito
CREATE POLICY "Students can view their own purchases" ON pack_purchases
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own credit ledger" ON credit_ledger
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );

-- Inserción de compras desde el cliente (solo en estado 'pending')
CREATE POLICY "Students can create pending purchase" ON pack_purchases
    FOR INSERT WITH CHECK (
        status = 'pending' AND
        user_id IN (
            SELECT id FROM profiles WHERE auth_user_id = auth.uid()
        )
    );
