import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import WebSocket from 'ws';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    realtime: {
      transport: WebSocket,
    },
  }
);

const AREA_NAMES = {
  mumbai: ['Andheri West', 'Bandra Kurla', 'Lower Parel', 'Borivali', 'Malad', 'Thane', 'Navi Mumbai', 'Powai', 'Juhu', 'Ghatkopar'],
  pune: ['Kalyani Nagar', 'Baner', 'Camp', 'Rasta Peth', 'Wanowrie', 'Hadapsar', 'Karvenagar', 'Erandwane', 'Shivajinagar', 'Pimpri', 'FC Road', 'Viman Nagar'],
  bangalore: ['Indiranagar', 'Koramangala', 'MG Road', 'Whitefield', 'Jayanagar', 'Marathahalli', 'Electronic City', 'Yelahanka', 'Sadashiva Nagar', 'JP Nagar'],
  delhi: ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Greater Kailash', 'Pitampura', 'Hauz Khas'],
  hyderabad: ['Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Kukatpally', 'Begumpet', 'Secunderabad', 'Ameerpet', 'Kondapur'],
  chennai: ['T Nagar', 'Velachery', 'Adyar', 'Anna Nagar', 'Mylapore', 'Thoraipakkam', 'Guindy', 'Porur', 'Nungambakkam', 'Chromepet'],
  kolkata: ['Salt Lake', 'New Town', 'Alipore', 'Ballygunge', 'Dum Dum', 'Howrah', 'Park Street', 'Rajarhat', 'Behala', 'Barasat'],
  ahmedabad: ['Navrangpura', 'Prahlad Nagar', 'SG Highway', 'Bodakdev', 'Maninagar', 'Satellite', 'Vastrapur', 'Chandkheda', 'Naranpura', 'Thaltej'],
};

const HOSPITAL_CHAINS = [
  'Apollo Clinic',
  'Manipal Hospital',
  'Jehangir Hospital',
  'KEM Hospital',
  'Ruby Hall Clinic',
  'Noble Hospital',
  'Sahyadri Hospital',
  'Deenanath Mangeshkar Hospital',
  'Sancheti Hospital',
  'Aditya Birla Hospital',
  'City Hospital',
  'Fortis Hospital',
];

const SPECIALTIES_POOL = [
  ['Cardiology', 'General', 'Orthopedics'],
  ['Cardiology', 'Neurology', 'Pediatrics'],
  ['General', 'Cardiology', 'Pulmonology'],
  ['General', 'Cardiology', 'Pediatrics'],
  ['Cardiology', 'Neurology', 'General'],
  ['General', 'Orthopedics', 'Dermatology'],
  ['Cardiology', 'General', 'Neurology'],
  ['Cardiology', 'General', 'Orthopedics', 'Pediatrics'],
  ['Orthopedics', 'General'],
  ['Cardiology', 'General', 'Neurology'],
  ['General', 'Cardiology', 'Dermatology'],
  ['Cardiology', 'General', 'Neurology'],
];

const DOCTOR_TEMPLATES = [
  [
    { name: 'Dr. Sanjay Verma', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Priya Mehta', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Amit Khanna', specialty: 'Orthopedics', avg_consult_minutes: 20 },
  ],
  [
    { name: 'Dr. Rohan Deshpande', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Sneha Patil', specialty: 'Pediatrics', avg_consult_minutes: 12 },
    { name: 'Dr. Vikram Joshi', specialty: 'Neurology', avg_consult_minutes: 25 },
  ],
  [
    { name: 'Dr. Anita Kulkarni', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Prakash Rao', specialty: 'Pulmonology', avg_consult_minutes: 18 },
    { name: 'Dr. Meera Joshi', specialty: 'Gastroenterology', avg_consult_minutes: 20 },
  ],
  [
    { name: 'Dr. Shailesh Datar', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Nisha Agarwal', specialty: 'Pediatrics', avg_consult_minutes: 12 },
  ],
  [
    { name: 'Dr. Arjun Nair', specialty: 'Cardiology', avg_consult_minutes: 18 },
    { name: 'Dr. Deepa Shah', specialty: 'Neurology', avg_consult_minutes: 22 },
  ],
  [
    { name: 'Dr. Rajesh Patwardhan', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Kavita Deshmukh', specialty: 'Dermatology', avg_consult_minutes: 15 },
    { name: 'Dr. Sameer Khan', specialty: 'ENT', avg_consult_minutes: 12 },
  ],
  [
    { name: 'Dr. Aditya Thakur', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Pallavi Kulkarni', specialty: 'General Physician', avg_consult_minutes: 10 },
  ],
  [
    { name: 'Dr. Mohan Tendulkar', specialty: 'Cardiology', avg_consult_minutes: 18 },
    { name: 'Dr. Sunita Desai', specialty: 'Pediatrics', avg_consult_minutes: 12 },
    { name: 'Dr. Ravi Bapat', specialty: 'Orthopedics', avg_consult_minutes: 20 },
    { name: 'Dr. Anjali Dixit', specialty: 'Pulmonology', avg_consult_minutes: 16 },
  ],
  [
    { name: 'Dr. Kiran Sancheti', specialty: 'Orthopedics', avg_consult_minutes: 20 },
    { name: 'Dr. Reshma Iyer', specialty: 'Physical Therapy', avg_consult_minutes: 25 },
  ],
  [
    { name: 'Dr. Suresh Bhosale', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Neha Sharma', specialty: 'Pediatrics', avg_consult_minutes: 12 },
  ],
  [
    { name: 'Dr. Priya Sharma', specialty: 'Cardiology', avg_consult_minutes: 15 },
    { name: 'Dr. Rakesh Jain', specialty: 'General Physician', avg_consult_minutes: 10 },
    { name: 'Dr. Tina Bagwe', specialty: 'Dermatology', avg_consult_minutes: 15 },
  ],
  [
    { name: 'Dr. Manoj Agarwal', specialty: 'Cardiology', avg_consult_minutes: 18 },
    { name: 'Dr. Shweta Mishra', specialty: 'Neurology', avg_consult_minutes: 22 },
  ],
];

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getAreas(city) {
  const key = city.toLowerCase().replace(/\s+/g, '');
  return AREA_NAMES[key] || [capitalize(city)];
}

function buildHospitals(city) {
  const areas = getAreas(city);
  return HOSPITAL_CHAINS.map((chain, i) => ({
    name: `${chain} - ${areas[i % areas.length]}`,
    city,
    specialty_tags: SPECIALTIES_POOL[i % SPECIALTIES_POOL.length],
    doctors: DOCTOR_TEMPLATES[i % DOCTOR_TEMPLATES.length],
  }));
}

async function seed(city) {
  const cityLabel = capitalize(city);
  const hospitals = buildHospitals(city);
  console.log(`Seeding ${hospitals.length} ${cityLabel} hospitals and doctors...\n`);

  for (const hosp of hospitals) {
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
        console.log(`    ✓ ${doc.name} (${doc.specialty})`);
      }
    }
  }

  console.log(`\n✅ ${cityLabel} seeding complete!`);
}

const cityArg = process.argv.find(a => a.startsWith('--city='))?.split('=')[1] || process.argv[2] || 'pune';
const targetCity = cityArg.toLowerCase().replace(/\s+/g, '');

seed(targetCity).catch((err) => {
  console.error(err);
  process.exit(1);
});
