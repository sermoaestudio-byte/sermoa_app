import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('studios').update({ name: 'Sermoa Test' }).eq('id', 'c0a80121-7f9a-4b3c-8d1e-2f3a4b5c6d7e');
  console.log('Update result:', error || 'Success');
}
test();
