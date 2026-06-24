import { useState, useEffect } from 'react';
import { hospitalService, queueService } from '../services/api';
import { Activity, Users } from 'lucide-react';

export default function Dashboard() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [lastCalled, setLastCalled] = useState<any>(null);

  useEffect(() => {
    hospitalService.getHospitals().then(data => {
      setHospitals(data || []);
      setLoading(false);
      if (data && data[0]?.doctors?.[0]) {
        setSelectedDoctorId(data[0].doctors[0].id);
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleCallNext = async () => {
    if (!selectedDoctorId) return;
    try {
      const res = await queueService.callNext(selectedDoctorId);
      if (res.success) {
        setLastCalled(res.nextToken);
      } else {
        alert(res.error || 'No more patients in queue');
      }
    } catch (err) {
      alert('Error calling next patient');
    }
  };

  if (loading) return <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-[32px] border border-white/10 p-8 shadow-card">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-text-secondary mb-2">Receptionist dashboard</p>
              <h1 className="text-4xl font-display font-bold text-white">Keep the clinic queue moving</h1>
              <p className="mt-3 text-text-secondary max-w-2xl">Manage doctors, call the next patient, and see current queue progress from one place.</p>
            </div>
            <button onClick={handleCallNext} className="btn-primary rounded-[24px] px-6 py-3">Call next patient</button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] bg-bg/80 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-primary" />
                <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Last called</p>
              </div>
              <p className="text-3xl font-semibold text-white">{lastCalled ? `#${lastCalled.token_number}` : '--'}</p>
              <p className="text-sm text-text-secondary mt-2">Priority: {lastCalled?.priority || '--'}</p>
            </div>
            <div className="rounded-[28px] bg-bg/80 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-accent" />
                <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Active doctors</p>
              </div>
              <p className="text-3xl font-semibold text-white">{hospitals.reduce((sum, hospital) => sum + (hospital.doctors?.length || 0), 0)}</p>
              <p className="text-sm text-text-secondary mt-2">Available in your network</p>
            </div>
            <div className="rounded-[28px] bg-bg/80 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Doctor roster</p>
              </div>
              <select
                className="w-full rounded-[18px] border border-white/10 bg-bg/90 px-4 py-3 text-text-primary outline-none"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                {hospitals.map(hospital => (
                  <optgroup key={hospital.id} label={hospital.name}>
                    {hospital.doctors?.map((doc: any) => (
                      <option key={doc.id} value={doc.id}>{doc.name} — {doc.specialty}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
