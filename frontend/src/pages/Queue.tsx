import { useState, useEffect } from 'react';
import { hospitalService, queueService } from '../services/api';
import { CheckCircle, Navigation2, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Queue() {
  // navigate removed: not used in this component
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [token, setToken] = useState<any>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // removed unused error state

  useEffect(() => {
    hospitalService.getHospitals().then((data) => {
      const hospitals = data || [];
      setHospitals(hospitals);
      if (hospitals[0]?.doctors?.[0]) {
        setSelectedDoctorId(hospitals[0].doctors[0].id);
      }
      setLoading(false);
    }).catch(() => {
      // failed to load hospitals
      setHospitals([]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!token || !selectedDoctorId) return;

    const streamUrl = queueService.getStreamUrl(selectedDoctorId);
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CALL_NEXT') {
        setEvents((prev) => [...prev, `Token #${data.tokenNumber} called.`]);
        if (data.tokenId === token.id) {
          alert("It's your turn!");
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, [token, selectedDoctorId]);

  const handleCreateToken = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) {
        alert('Please login first!');
        return;
      }

      const data = await queueService.createToken({
        doctorId: selectedDoctorId,
        priority: 'routine',
        symptoms: 'Checkup',
        userId: user.id,
      });

      if (data.error) {
        alert(data.error);
      } else {
        setToken(data);
      }
    } catch (err) {
      alert('Failed to create token.');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-text-secondary mb-2">Live Queue Tracker</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Stay ready with live queue updates.</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-surface/70 px-5 py-3 text-sm text-text-secondary inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" /> On Track
          </div>
        </div>

        {loading ? (
          <div className="glass-card rounded-[32px] p-10 text-center">
            <p className="text-text-secondary">Loading hospitals and queue data...</p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="glass-card rounded-[32px] border border-white/10 bg-surface/80 p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white">Your token status</h2>
                  <p className="text-text-secondary max-w-xl">Track your token in real time and get notified as your appointment progress updates.</p>
                </div>
                <button onClick={handleCreateToken} className="btn-primary rounded-[20px] px-6 py-3 text-sm font-semibold">
                  {token ? 'Refresh token' : 'Generate token'}
                </button>
              </div>

              {!token ? (
                <div className="mt-10 grid gap-6 md:grid-cols-[1.8fr_0.8fr] items-end">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Select doctor</label>
                    <select
                      className="input-field"
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                    >
                      {hospitals.map((hospital) => (
                        <optgroup key={hospital.id} label={hospital.name}>
                          {hospital.doctors?.map((doc: any) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} · {doc.specialty}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleCreateToken} className="btn-primary w-full md:w-auto rounded-[20px] px-6 py-4">
                    Book token
                  </button>
                </div>
              ) : (
                <div className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                  <div className="rounded-[32px] border border-white/10 bg-bg/80 p-8">
                    <p className="text-sm uppercase tracking-[0.28em] text-text-secondary mb-4">Current token</p>
                    <div className="flex items-end gap-6">
                      <div className="text-[5rem] font-mono font-bold text-white leading-none">#{token.token_number}</div>
                      <div className="rounded-[26px] bg-[#0F172A]/95 border border-white/10 px-4 py-3 text-sm text-text-secondary">
                        <p>Position</p>
                        <p className="text-xl font-semibold text-white">{token.position || 4}</p>
                      </div>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      <div className="rounded-[28px] border border-white/10 bg-surface/80 p-5">
                        <p className="text-xs uppercase tracking-[0.28em] text-text-secondary mb-2">Doctor</p>
                        <p className="text-lg font-semibold text-white">{token.doctor || 'Dr. Priya Sharma'}</p>
                        <p className="text-sm text-text-secondary mt-1">{token.specialty || 'Cardiology'}</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-surface/80 p-5">
                        <p className="text-xs uppercase tracking-[0.28em] text-text-secondary mb-2">Clinic</p>
                        <p className="text-lg font-semibold text-white">{token.clinic || 'City Care Hospital'}</p>
                        <p className="text-sm text-text-secondary mt-1">{token.location || 'Indiranagar'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-white/10 bg-bg/80 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-text-secondary">Estimated arrival</p>
                        <p className="text-3xl font-semibold text-primary">{new Date(token.ets).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="badge-pill badge-available">Live</div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-[28px] bg-surface/80 border border-white/10 p-5 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Navigation2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Expected arrival</p>
                          <p className="text-lg font-semibold text-white">{new Date(token.ets).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="rounded-[28px] bg-surface/80 border border-white/10 p-5 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Patients ahead</p>
                          <p className="text-lg font-semibold text-white">{token.position || 4}</p>
                        </div>
                      </div>
                      <div className="rounded-[28px] bg-surface/80 border border-white/10 p-5 text-text-secondary">
                        <p className="text-sm">Latest update</p>
                        <p className="text-lg font-semibold text-white">{token.status || 'Queued'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <aside className="glass-card rounded-[32px] border border-white/10 bg-bg/80 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-text-secondary">Status feed</p>
                  <h2 className="text-2xl font-semibold text-white">Live updates</h2>
                </div>
                <button onClick={() => window.location.reload()} className="text-sm text-primary inline-flex items-center gap-2">
                  Refresh <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="rounded-[24px] border border-white/10 bg-surface/80 px-4 py-5 text-sm text-text-secondary">
                    Waiting for new queue events...
                  </div>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="rounded-[24px] border border-white/10 bg-bg/90 px-4 py-4 text-sm text-white">
                      {event}
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
