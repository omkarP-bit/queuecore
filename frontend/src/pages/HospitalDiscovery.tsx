import { useState, useEffect } from 'react';
import { Search, Filter, Clock, MapPinOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hospitalService } from '../services/api';

export default function HospitalDiscovery() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          fetchHospitals('Pune');
        },
        () => {
          fetchHospitals();
        }
      );
    } else {
      fetchHospitals();
    }
  }, []);

  const fetchHospitals = async (city?: string) => {
    setLoading(true);
    try {
      const data = await hospitalService.getHospitals(city ? { city } : {});
      setHospitals(data || []);
    } catch (e) {
      console.error(e);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-8 text-text-primary">
      <div className="max-w-7xl mx-auto grid gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-8">
          <div className="glass-card rounded-[32px] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Filters</h3>
            </div>

            {!locationEnabled && (
              <div className="rounded-[24px] border border-primary/20 bg-primary/10 p-4 mb-6">
                <p className="text-sm text-primary">Enable location to find hospitals nearest to you.</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Specialty</label>
                <select className="input-field bg-bg w-full">
                  <option>Any Specialty</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Rating</label>
                <select className="input-field bg-bg w-full">
                  <option>★★★★☆ 4.0+</option>
                  <option>★★★★★ 4.5+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Distance</label>
                <select className="input-field bg-bg w-full">
                  <option>0 - 10 km</option>
                  <option>0 - 5 km</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded-[8px] border border-border bg-bg text-primary focus:ring-primary" />
                <label className="text-sm text-text-primary">Available now only</label>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-6">
            <h4 className="text-base font-semibold text-white mb-4">Nearby Clinics</h4>
            <div className="space-y-4 text-sm text-text-secondary">
              <div className="rounded-[22px] border border-white/10 bg-bg p-4">Indiranagar, Bangalore</div>
              <div className="rounded-[22px] border border-white/10 bg-bg p-4">Koramangala, Bangalore</div>
              <div className="rounded-[22px] border border-white/10 bg-bg p-4">MG Road, Bangalore</div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="glass-card rounded-[32px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-text-secondary">Hospital discovery</p>
              <h1 className="text-3xl font-display font-bold text-white mt-3">Find the right clinic in minutes.</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input type="text" placeholder="Search hospital, doctor, specialty..." className="input-field pl-12 w-full bg-bg" />
              </div>
              <select className="input-field bg-bg w-full sm:w-[180px]">
                <option>Sort by: Availability</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Distance</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm text-text-secondary">
            <span>{loading ? 'Loading clinics…' : `${hospitals.length} hospitals found`}</span>
            <span className="inline-flex items-center gap-2 text-accent">
              <span className="h-2.5 w-2.5 rounded-full bg-accent pulse-ring relative" /> Live data enabled
            </span>
          </div>

          {loading ? (
            <div className="glass-card rounded-[32px] p-10 text-center text-text-secondary">Loading clinics near you...</div>
          ) : hospitals.length === 0 ? (
            <div className="glass-card rounded-[32px] p-10 text-center">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-white/5 text-slate-400">
                <MapPinOff className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">No clinics match your filters</h2>
              <p className="text-text-secondary mb-6">Try removing the specialty filter or expanding your distance range to see more clinics.</p>
              <button onClick={() => fetchHospitals()} className="btn-secondary">Reset filters</button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {hospitals.map((h) => (
                <div key={h.id} className="glass-card rounded-[32px] p-6 border-white/10 group hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1">{h.name}</h3>
                      <p className="text-sm text-text-secondary">{h.city || 'Bangalore, Karnataka'}</p>
                    </div>
                    <div className="badge-pill badge-available">Available</div>
                  </div>

                  <p className="text-sm text-text-secondary mb-4">{h.doctors?.[0]?.name || 'Dr. Availability'} · <span className="text-primary">{h.specialty_tags?.[0] || 'General'}</span></p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Avg consult</span>
                      <span>15 min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>Queue length</span>
                      <span className="font-mono">2</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>Est. wait</span>
                      <span className="text-primary font-semibold">~30 min</span>
                    </div>
                  </div>

                  <button onClick={() => navigate(`/patient/book/${h.doctors?.[0]?.id || h.id}`)} className="btn-primary w-full">Book Token →</button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
