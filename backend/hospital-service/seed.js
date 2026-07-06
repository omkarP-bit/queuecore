import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const HOSPITALS = [
  {
    name: 'Apollo Clinic - Kalyani Nagar',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'General', 'Orthopedics', 'Dermatology'],
    doctors: [
      { name: 'Dr. Sanjay Verma', specialty: 'Cardiology', avg_consult_minutes: 15 },
      { name: 'Dr. Priya Mehta', specialty: 'General Physician', avg_consult_minutes: 10 },
      { name: 'Dr. Amit Khanna', specialty: 'Orthopedics', avg_consult_minutes: 20 },
    ],
  },
  {
    name: 'Manipal Hospital - Baner',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'Neurology', 'Pediatrics', 'General'],
    doctors: [
      { name: 'Dr. Rohan Deshpande', specialty: 'Cardiology', avg_consult_minutes: 15 },
      { name: 'Dr. Sneha Patil', specialty: 'Pediatrics', avg_consult_minutes: 12 },
      { name: 'Dr. Vikram Joshi', specialty: 'Neurology', avg_consult_minutes: 25 },
    ],
  },
  {
    name: 'Jehangir Hospital - Camp',
    city: 'Pune',
    specialty_tags: ['General', 'Cardiology', 'Pulmonology', 'Gastroenterology'],
    doctors: [
      { name: 'Dr. Anita Kulkarni', specialty: 'General Physician', avg_consult_minutes: 10 },
      { name: 'Dr. Prakash Rao', specialty: 'Pulmonology', avg_consult_minutes: 18 },
      { name: 'Dr. Meera Joshi', specialty: 'Gastroenterology', avg_consult_minutes: 20 },
    ],
  },
  {
    name: 'KEM Hospital - Rasta Peth',
    city: 'Pune',
    specialty_tags: ['General', 'Cardiology', 'Orthopedics', 'Pediatrics'],
    doctors: [
      { name: 'Dr. Shailesh Datar', specialty: 'Cardiology', avg_consult_minutes: 15 },
      { name: 'Dr. Nisha Agarwal', specialty: 'Pediatrics', avg_consult_minutes: 12 },
    ],
  },
  {
    name: 'Ruby Hall Clinic - Wanowrie',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'Neurology', 'Oncology', 'General'],
    doctors: [
      { name: 'Dr. Arjun Nair', specialty: 'Cardiology', avg_consult_minutes: 18 },
      { name: 'Dr. Deepa Shah', specialty: 'Neurology', avg_consult_minutes: 22 },
    ],
  },
  {
    name: 'Noble Hospital - Hadapsar',
    city: 'Pune',
    specialty_tags: ['General', 'Orthopedics', 'Dermatology', 'ENT'],
    doctors: [
      { name: 'Dr. Rajesh Patwardhan', specialty: 'General Physician', avg_consult_minutes: 10 },
      { name: 'Dr. Kavita Deshmukh', specialty: 'Dermatology', avg_consult_minutes: 15 },
      { name: 'Dr. Sameer Khan', specialty: 'ENT', avg_consult_minutes: 12 },
    ],
  },
  {
    name: 'Sahyadri Hospital - Karvenagar',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'General', 'Neurology', 'Urology'],
    doctors: [
      { name: 'Dr. Aditya Thakur', specialty: 'Cardiology', avg_consult_minutes: 15 },
      { name: 'Dr. Pallavi Kulkarni', specialty: 'General Physician', avg_consult_minutes: 10 },
    ],
  },
  {
    name: 'Deenanath Mangeshkar Hospital - Erandwane',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'General', 'Orthopedics', 'Pediatrics', 'Pulmonology'],
    doctors: [
      { name: 'Dr. Mohan Tendulkar', specialty: 'Cardiology', avg_consult_minutes: 18 },
      { name: 'Dr. Sunita Desai', specialty: 'Pediatrics', avg_consult_minutes: 12 },
      { name: 'Dr. Ravi Bapat', specialty: 'Orthopedics', avg_consult_minutes: 20 },
      { name: 'Dr. Anjali Dixit', specialty: 'Pulmonology', avg_consult_minutes: 16 },
    ],
  },
  {
    name: 'Sancheti Hospital - Shivajinagar',
    city: 'Pune',
    specialty_tags: ['Orthopedics', 'General', 'Physical Therapy'],
    doctors: [
      { name: 'Dr. Kiran Sancheti', specialty: 'Orthopedics', avg_consult_minutes: 20 },
      { name: 'Dr. Reshma Iyer', specialty: 'Physical Therapy', avg_consult_minutes: 25 },
    ],
  },
  {
    name: 'Aditya Birla Hospital - Pimpri',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'General', 'Neurology', 'Pediatrics'],
    doctors: [
      { name: 'Dr. Suresh Bhosale', specialty: 'Cardiology', avg_consult_minutes: 15 },
      { name: 'Dr. Neha Sharma', specialty: 'Pediatrics', avg_consult_minutes: 12 },
    ],
  },
  {
    name: 'City Hospital - FC Road',
    city: 'Pune',
    specialty_tags: ['General', 'Cardiology', 'Dermatology', 'ENT'],
    doctors: [
      { name: 'Dr. Priya Sharma', specialty: 'Cardiology', avg_consult_minutes: 15 },
      { name: 'Dr. Rakesh Jain', specialty: 'General Physician', avg_consult_minutes: 10 },
      { name: 'Dr. Tina Bagwe', specialty: 'Dermatology', avg_consult_minutes: 15 },
    ],
  },
  {
    name: 'Fortis Hospital - Viman Nagar',
    city: 'Pune',
    specialty_tags: ['Cardiology', 'General', 'Neurology', 'Oncology'],
    doctors: [
      { name: 'Dr. Manoj Agarwal', specialty: 'Cardiology', avg_consult_minutes: 18 },
      { name: 'Dr. Shweta Mishra', specialty: 'Neurology', avg_consult_minutes: 22 },
    ],
  },
];

async function seed() {
  console.log('Seeding Pune hospitals and doctors...\n');

  for (const hosp of HOSPITALS) {
    const hospId = crypto.randomUUID();

    const { error: hospError } = await supabase.from('hospitals').insert([
      {
        id: hospId,
        name: hosp.name,
        city: hosp.city,
        specialty_tags: hosp.specialty_tags,
      },
    ]);

    if (hospError) {
      console.error(`  ✗ ${hosp.name}: ${hospError.message}`);
      continue;
    }
    console.log(`  ✓ Hospital: ${hosp.name}`);

    for (const doc of hosp.doctors) {
      const docId = crypto.randomUUID();
      const { error: docError } = await supabase.from('doctors').insert([
        {
          id: docId,
          hospital_id: hospId,
          name: doc.name,
          specialty: doc.specialty,
          avg_consult_minutes: doc.avg_consult_minutes,
          lag_rolling: 0,
          availability_status: 'available',
        },
      ]);

      if (docError) {
        console.error(`    ✗ ${doc.name}: ${docError.message}`);
      } else {
        console.log(`    ✓ Dr. ${doc.name} (${doc.specialty})`);
      }
    }
  }

  console.log('\n✅ Seeding complete!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
