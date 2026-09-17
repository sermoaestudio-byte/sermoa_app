import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajihsfsjntwolkoxwcbe.supabase.co';
const supabaseAnonKey = 'sb_publishable_x5f8VTXbe8f1zYAcjoNVzA_dMjG9FUp';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  const DEFAULT_STUDIO_ID = '11111111-1111-4111-8111-111111111111';
  const DEFAULT_BRANCH_ID = '22222222-2222-4222-8222-222222222222';
  const DEFAULT_ROOM_ID = '33333333-2222-4222-8222-222222222222';

  // Seed Branch
  console.log('Seeding branch...');
  await supabase.from('branches').upsert({
    id: DEFAULT_BRANCH_ID,
    studio_id: DEFAULT_STUDIO_ID,
    name: 'Sede Central',
    address: 'Av. Libertador 1000',
    city: 'Buenos Aires',
    phone: '1122334455',
    latitude: -34.5885,
    longitude: -58.4233,
    opening_hours: 'Lun a Vie 08:00 a 20:00 hs',
    is_active: true
  });

  // Seed Room
  console.log('Seeding room...');
  await supabase.from('rooms').upsert({
    id: DEFAULT_ROOM_ID,
    branch_id: DEFAULT_BRANCH_ID,
    name: 'Sala Principal',
    capacity: 12
  });

  // Seed Activities
  console.log('Seeding activities...');
  const initialActivities = [
    {
      id: 'c356fc39-50c5-430c-ab9e-a894a46a6f44',
      studio_id: DEFAULT_STUDIO_ID,
      name: 'Pilates Reformer',
      description: 'Trabajo integral de tonificación, postura y flexibilidad en reformer.',
      color: '#4d5d43',
      default_duration_minutes: 60,
    },
    {
      id: 'a57161b3-40e9-4e00-bf6c-674cd78a483e',
      studio_id: DEFAULT_STUDIO_ID,
      name: 'Yoga Vinyasa Flow',
      description: 'Fluidez, respiración consciente y fuerza postural.',
      color: '#8b5cf6',
      default_duration_minutes: 60,
    },
    {
      id: 'b23cd7c3-3f19-4a30-8439-d3e9816f1c4e',
      studio_id: DEFAULT_STUDIO_ID,
      name: 'Entrenamiento Funcional',
      description: 'Circuitos de fuerza, estabilidad y capacidad cardiovascular.',
      color: '#f59e0b',
      default_duration_minutes: 50,
    },
  ];
  await supabase.from('activities').upsert(initialActivities);

  console.log('Seeding financial categories...');
  const categories = [
    { id: '11111111-3333-4444-8888-999999999991', studio_id: DEFAULT_STUDIO_ID, name: 'Alquiler', type: 'expense', color: '#6366f1', is_active: true },
    { id: '11111111-3333-4444-8888-999999999992', studio_id: DEFAULT_STUDIO_ID, name: 'Venta de Pack', type: 'income', color: '#10b981', is_active: true },
  ];
  await supabase.from('financial_categories').upsert(categories);

  console.log('Done seeding!');
}
seed().catch(console.error);
