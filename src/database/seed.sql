-- Seed Hospitals
INSERT INTO hospitals (name, specialty_tags, rating, address, city) VALUES
('Ruby Hall Clinic', '{"Cardiology", "Oncology", "Neurology"}', 4.5, '40, Sassoon Road', 'Pune'),
('Jehangir Hospital', '{"General Medicine", "Orthopedics"}', 4.3, '32, Sassoon Road', 'Pune'),
('Sahyadri Super Speciality Hospital', '{"Transplant", "Cardiac"}', 4.4, 'Deccan Gymkhana', 'Pune'),
('Deenanath Mangeshkar Hospital', '{"Multispecialty", "Pediatrics"}', 4.6, 'Erandwane', 'Pune'),
('Noble Hospital', '{"General Surgery", "Gastroenterology"}', 4.2, 'Hadapsar', 'Pune'),
('Inlaks & Budhrani Hospital', '{"Cardiac Care", "Cancer Care"}', 4.1, 'Koregaon Park', 'Pune'),
('Lilavati Hospital', '{"Multispecialty", "Cardiac"}', 4.7, 'Bandra West', 'Mumbai'),
('Nanavati Max Super Speciality Hospital', '{"Cancer", "Critical Care"}', 4.5, 'Vile Parle West', 'Mumbai'),
('Kokilaben Dhirubhai Ambani Hospital', '{"Advanced Surgery", "Robotic Surgery"}', 4.8, 'Andheri West', 'Mumbai'),
('Jaslok Hospital', '{"Research", "Specialized Medicine"}', 4.4, 'Pedder Road', 'Mumbai'),
('Breach Candy Hospital', '{"General Surgery", "Maternity"}', 4.6, 'Bhulabhai Desai Road', 'Mumbai'),
('H. N. Reliance Foundation Hospital', '{"Digital Health", "Multispecialty"}', 4.7, 'Girgaon', 'Mumbai');

-- Seed Doctors (3 per hospital)
-- I'll use a script-like SQL to insert doctors for each hospital
DO $$
DECLARE
    h_id UUID;
BEGIN
    FOR h_id IN SELECT id FROM hospitals LOOP
        INSERT INTO doctors (hospital_id, name, specialty, fee_range, availability_status) VALUES
        (h_id, 'Dr. Rajesh Patil', 'Cardiology', '₹1000 - ₹2000', 'available'),
        (h_id, 'Dr. Sunita Deshmukh', 'General Medicine', '₹500 - ₹800', 'available'),
        (h_id, 'Dr. Amit Shah', 'Orthopedics', '₹800 - ₹1200', 'available');
    END LOOP;
END $$;
