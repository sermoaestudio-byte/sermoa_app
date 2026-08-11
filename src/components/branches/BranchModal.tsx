import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Building2,
  MapPin,
  Clock,
  Compass,
  Plus,
  Trash2,
  Save,
  Check,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { Branch, Room } from '../../types';
import { useStudioStore } from '../../store/studioStore';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchToEdit?: Branch | null;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  branchToEdit,
}) => {
  const { createBranch, updateBranch } = useStudioStore();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Buenos Aires');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('Lun a Vie 07:00 a 21:00 hs | Sáb 09:00 a 14:00 hs');
  const [latitude, setLatitude] = useState<number>(-34.5885);
  const [longitude, setLongitude] = useState<number>(-58.4233);
  const [rooms, setRooms] = useState<{ id?: string; name: string; capacity: number }[]>([
    { name: 'Sala Reformer', capacity: 10 },
  ]);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant?: 'primary' | 'danger';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'primary',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (branchToEdit) {
      setName(branchToEdit.name);
      setAddress(branchToEdit.address);
      setCity(branchToEdit.city);
      setPhone(branchToEdit.phone);
      setOpeningHours(branchToEdit.opening_hours);
      setLatitude(branchToEdit.latitude);
      setLongitude(branchToEdit.longitude);
      setRooms(
        branchToEdit.rooms && branchToEdit.rooms.length > 0
          ? branchToEdit.rooms.map((r) => ({ id: r.id, name: r.name, capacity: r.capacity }))
          : [{ name: 'Sala Principal', capacity: 10 }]
      );
    } else {
      setName('');
      setAddress('');
      setCity('Buenos Aires');
      setPhone('');
      setOpeningHours('Lun a Vie 07:00 a 21:00 hs | Sáb 09:00 a 14:00 hs');
      setLatitude(-34.5885);
      setLongitude(-58.4233);
      setRooms([{ name: 'Sala Reformer', capacity: 10 }]);
    }
  }, [branchToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddRoom = () => {
    setRooms([...rooms, { name: `Sala ${rooms.length + 1}`, capacity: 10 }]);
  };

  const handleRemoveRoom = (index: number) => {
    if (rooms.length === 1) {
      alert('La sucursal debe tener al menos una sala.');
      return;
    }
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleRoomChange = (index: number, field: 'name' | 'capacity', value: any) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], [field]: value };
    setRooms(updated);
  };

  const handleGetDeviceGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(6)));
          setLongitude(Number(pos.coords.longitude.toFixed(6)));
          alert('📍 Coordenadas GPS obtenidas correctamente desde tu dispositivo.');
        },
        (err) => {
          alert('No se pudo acceder al GPS del dispositivo. Por favor ingresa las coordenadas manualmente.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert('Por favor completa el nombre y la dirección de la sucursal.');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: branchToEdit ? '¿Guardar Cambios de la Sucursal?' : '¿Confirmar Creación de Sucursal?',
      message: branchToEdit
        ? `Se actualizará la información, salas y coordenadas de "${name}".`
        : `Se creará la sucursal "${name}" con ${rooms.length} sala(s) configurada(s).`,
      confirmText: branchToEdit ? 'Guardar Cambios' : 'Confirmar y Crear',
      variant: 'primary',
      onConfirm: () => {
        if (branchToEdit) {
          updateBranch(branchToEdit.id, {
            name,
            address,
            city,
            phone,
            opening_hours: openingHours,
            latitude: Number(latitude),
            longitude: Number(longitude),
            rooms: rooms.map((r, idx) => ({
              id: r.id || `room-${branchToEdit.id}-${idx + 1}`,
              branch_id: branchToEdit.id,
              name: r.name,
              capacity: Number(r.capacity) || 10,
            })),
          });
        } else {
          createBranch({
            name,
            address,
            city,
            phone,
            opening_hours: openingHours,
            latitude: Number(latitude),
            longitude: Number(longitude),
            rooms: rooms.map((r) => ({
              name: r.name,
              capacity: Number(r.capacity) || 10,
            })),
          });
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        onClose();
      },
    });
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-6 animate-fade-in">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 my-auto flex flex-col max-h-[88vh] overflow-hidden text-left">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/90 shrink-0">
            <div className="flex items-start space-x-3.5 pr-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs border border-amber-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full border border-amber-200">
                  Infraestructura
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1 leading-snug">
                  {branchToEdit ? 'Editar Sucursal' : 'Nueva Sucursal & Salas'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Establece la dirección física, salas con camas/cupos y ubicación GPS para check-in
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body with Internal Scroll and Fixed Footer */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0 text-xs">
              {/* General Info */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>1. Datos de la Sede</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre de la Sede *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Sede Central / Sede Palermo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Buenos Aires / Córdoba"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dirección Completa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Av. Libertador 1200"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp de Contacto</label>
                    <input
                      type="text"
                      placeholder="Ej: +54 11 5555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horarios de Apertura y Atención</label>
                  <input
                    type="text"
                    placeholder="Ej: Lun a Vie 07:00 a 21:00 hs | Sáb 09:00 a 14:00 hs"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Geolocation */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-slate-900">2. Coordenadas GPS (Para Check-in por QR)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetDeviceGPS}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-[10px] font-extrabold transition-colors shadow-2xs"
                  >
                    📍 Tomar GPS Actual
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Latitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-mono text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Longitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-mono text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rooms Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-tight flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>3. Salas & Capacidad de Camas/Alumnos</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Sala</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {rooms.map((room, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center space-x-3"
                    >
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nombre de Sala</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Sala Reformer / Sala Mat"
                          value={room.name}
                          onChange={(e) => handleRoomChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Capacidad Max</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={100}
                          value={room.capacity}
                          onChange={(e) => handleRoomChange(index, 'capacity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveRoom(index)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Eliminar sala"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold rounded-xl transition-colors text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-amber-600/20 text-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{branchToEdit ? 'Guardar Cambios' : 'Crear Sucursal'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>,
    document.body
  );
};
