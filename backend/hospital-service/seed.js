import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  const hospId = crypto.randomUUID();
  const docId = crypto.randomUUID();

  const hospitalRes = await supabase.from('hospitals').insert([
    {
      id: hospId,
      name: 'City General Hospital',
      city: 'Pune',
      specialty_tags: ['General', 'Cardiology']
    }
  ]).select();
  
  if (hospitalRes.data) {
    const doctorRes = await supabase.from('doctors').insert([
      {
        id: docId,
        hospital_id: hospId,
        name: 'Dr. Sharma',
        specialty: 'Cardiology',
        avg_consult_minutes: 15,
        lag_rolling: 0
      }
    ]).select();
    
    console.log("Doctor Insert:", doctorRes.error || doctorRes.data);
  }
}
seed();
