-- Hospitals Table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty_tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3, 2) DEFAULT 0.0,
    address TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    avg_consult_minutes INTEGER DEFAULT 15,
    fee_range TEXT,
    availability_status TEXT DEFAULT 'available', -- available, busy, offline
    lag_rolling INTEGER DEFAULT 0, -- in minutes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    gov_id_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tokens Table
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_number INTEGER NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    priority TEXT NOT NULL DEFAULT 'routine', -- routine, urgent, emergency
    status TEXT NOT NULL DEFAULT 'waiting', -- waiting, called, done, cancelled
    source TEXT NOT NULL DEFAULT 'online', -- online, walk_in
    ets TIMESTAMPTZ, -- Estimated Time Start
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
    report_url TEXT,
    actual_duration INTEGER, -- in minutes
    status TEXT DEFAULT 'active', -- active, completed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX idx_tokens_doctor_status ON tokens(doctor_id, status);
CREATE INDEX idx_tokens_patient ON tokens(patient_id);
CREATE INDEX idx_patients_phone ON patients(phone);

-- Enable Realtime for tokens
-- Note: This is usually done via Supabase UI or ALTER PUBLICATION supabase_realtime ADD TABLE tokens;
-- But it requires permissions. I'll add the command here.
ALTER PUBLICATION supabase_realtime ADD TABLE tokens;
