import { useState, useEffect } from 'react';
import { Search, Filter, Clock, MapPinOff, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hospitalService } from '../services/api';

export default function HospitalDiscovery() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    // Ask for location on mount
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          // For hackathon, we assume the location is "Pune" since our DB has Pune hospitals
          // In real life, we would reverse geocode the position.coords
          fetchHospitals('Pune');
        },
        () => {
          // If denied, we fetch without city
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
    <div className="min-h-screen bg-bg p-4 md:p-8 font-sans">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* SEARCH BAR & PROFILE */}
        <div className="flex gap-4">
          <div className="w-full bg-surface rounded-[24px] shadow-none flex items-center px-4 h-[64px] border border-border focus-within:border-primary/50 transition-colors duration-300">
            <Search className="w-6 h-6 text-text-muted mr-3" />
            <input 
              type="text" 
              placeholder="Search by hospital, doctor, or specialty..." 
              className="flex-1 bg-transparent border-none outline-none text-[16px] text-text-primary placeholder:text-text-muted"
            />
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="bg-surface rounded-[24px] flex items-center justify-center w-[64px] h-[64px] border border-border hover:border-primary/50 transition-all duration-300 group"
          >
            <User className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* FILTERS SIDEBAR */}
          <aside className="w-full md:w-[260px] shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-text-primary" />
              <h3 className="font-display font-semibold text-[17px] text-text-primary">Filters</h3>
            </div>
            <div className="space-y-6">
              {!locationEnabled && (
                <div className="bg-warning/10 p-3 rounded-lg border border-warning/30">
                  <p className="text-[12px] text-warning font-medium">Enable location to find hospitals nearest to you.</p>
                </div>
              )}
              <div>
                <label className="text-[13px] font-medium text-text-secondary mb-2 block">Specialty</label>
                <select className="input-field bg-bg">
                  <option>Any Specialty</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary mb-2 block">Rating</label>
                <select className="input-field bg-bg">
                  <option>★★★★☆ 4.0+</option>
                  <option>★★★★★ 4.5+</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-medium text-text-secondary mb-2 block">Distance</label>
                <select className="input-field bg-bg">
                  <option>0 - 10 km</option>
                  <option>0 - 5 km</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 rounded-[4px] border-border bg-surface text-primary focus:ring-primary focus:ring-offset-bg" />
                <label className="text-[15px] text-text-primary">Available now only</label>
              </div>
            </div>
          </aside>

          {/* RESULTS GRID */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] text-text-secondary">{hospitals.length} hospitals found</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-text-secondary">Sort:</span>
                <select className="bg-transparent border-none outline-none text-[15px] font-medium text-text-primary cursor-pointer">
                  <option>Nearest</option>
                  <option>Shortest wait</option>
                  <option>Best rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-text-secondary">Loading clinics near you...</div>
            ) : hospitals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                  <MapPinOff className="w-10 h-10 text-text-muted" strokeWidth={1.5} />
                </div>
                <h2 className="font-display font-semibold text-[24px] text-text-primary mb-2">No clinics match your filters</h2>
                <p className="text-text-secondary mb-6 max-w-sm">Try removing the specialty filter or expanding your distance range to see more clinics.</p>
                <button onClick={() => fetchHospitals()} className="btn-secondary">Reset filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {hospitals.map(h => (
                  <div key={h.id} className="card card-hover flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-text-primary mb-1">{h.name}</h3>
                        <p className="text-xs text-text-secondary">{h.city || 'Bangalore, Karnataka'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-accent/20 px-2.5 py-1 rounded-full shrink-0 ml-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-ping absolute"></div>
                        <div className="w-2 h-2 rounded-full bg-accent relative"></div>
                        <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Available</span>
                      </div>
                    </div>
                    
                    <hr className="border-border my-4" />
                    
                    <div className="text-[15px] font-medium text-text-primary mb-1">
                      {h.doctors?.[0]?.name || 'Dr. Availability'} · <span className="text-primary">{h.specialty_tags?.[0] || 'General'}</span>
                    </div>
                    <div className="text-[13px] text-text-secondary flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5" /> ~15 min avg consult
                    </div>
                    <div className="text-[13px] text-text-secondary mb-6 flex items-center gap-2">
                      <span className="font-mono bg-surface border border-border px-1.5 py-0.5 rounded">₹300-500</span> Consult Fee
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 bg-bg rounded-[12px] p-3 border border-border">
                      <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                        <span className="font-mono font-bold text-text-primary text-lg">2</span> waiting in queue
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-text-muted uppercase font-bold tracking-wider mb-0.5">EST. TIME</div>
                        <div className="text-primary font-mono font-bold text-[13px]">~30 min</div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/patient/book/${h.doctors?.[0]?.id || h.id}`)}
                      className="btn-primary w-full mt-auto bg-surface border-[1.5px] border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Book Token →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
