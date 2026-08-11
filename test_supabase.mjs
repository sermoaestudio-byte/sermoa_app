import { createClient } from '@supabase/supabase-js';

const url = 'https://ajihsfsjntwolkoxwcbe.supabase.co';
const key = 'sb_publishable_x5f8VTXbe8f1zYAcjoNVzA_dMjG9FUp';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase connection...');
  
  // 1. Check studios
  const { data: studios, error: studioErr } = await supabase.from('studios').select('*');
  console.log('Studios:', { count: studios?.length, error: studioErr });

  // 2. Check profiles
  const { data: profiles, error: profileErr } = await supabase.from('profiles').select('*');
  console.log('Profiles:', { count: profiles?.length, error: profileErr });

  // 3. Test insert student
  const testId = 'a0000000-0000-4000-a000-000000000001';
  const studioId = studios?.[0]?.id || '11111111-1111-4111-a111-111111111111';
  
  console.log('Attempting insert with studioId:', studioId);
  const { data: insertData, error: insertErr } = await supabase.from('profiles').upsert({
    id: testId,
    studio_id: studioId,
    role: 'admin',
    status: 'active',
    first_name: 'Test',
    last_name: 'Admin',
    email: 'test.alumno@sermoa.app',
    phone: '+5491100000000',
    credits_balance: 5,
    debt_amount: 0,
  }).select();

  console.log('Insert result:', { insertData, insertErr });

  // 4. Test delete student
  const { error: delErr } = await supabase.from('profiles').delete().eq('id', testId);
  console.log('Delete result:', { delErr });
}

test();
