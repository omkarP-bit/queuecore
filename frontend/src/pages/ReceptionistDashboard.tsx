import { useState } from 'react';
import { Plus, ChevronDown, Radio } from 'lucide-react';

export default function ReceptionistDashboard() {
  const [tokens, setTokens] = useState<any[]>([
    { id: '1', token_number: 42, patient_name: 'R. Sharma', priority: 'active', source: 'online', ets: 'NOW' },
    { id: '2', token_number: 43, patient_name: 'P. Gupta', priority: 'urgent', source: 'walk-in', ets: '2:30 PM' },
    { id: '3', token_number: 44, patient_name: 'A. Mehta', priority: 'routine', source: 'online', ets: '3:00 PM' },
  ]);
  const [loadingCall, setLoadingCall] = useState(false);

  // In a real app, we would fetch tokens for the logged in receptionist's doctor.

  const handleCallNext = async () => {
    setLoadingCall(true);
    try {
      // Mocking the call next action with a delay
      setTimeout(() => {
        setTokens(prev => {
          const next = [...prev];
          next[0].priority = 'done';
          next[1].priority = 'active';
          next[1].ets = 'NOW';
          return next.slice(1);
        });
        setLoadingCall(false);
      }, 600);
    } catch (e) {
      setLoadingCall(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-[240px] bg-white border-r border-border p-6 flex flex-col gap-8 shrink-0 shadow-[2px_0_8px_rgba(0,0,0,0.02)] z-10 relative">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[20px]">🏥</span>
            <span className="font-display font-bold text-text-primary">City Hospital</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 bg-bg rounded-[6px] cursor-pointer hover:bg-[#E2E8F0] transition-colors mt-4">
            <span className="text-[13px] font-medium text-text-primary">Dr. Priya Sharma</span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {['Dashboard', 'Patients', 'Reports', 'Settings'].map((item, i) => (
            <div key={item} className={`px-3 py-2 rounded-[8px] text-[15px] font-medium cursor-pointer transition-colors ${i === 0 ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-bg hover:text-text-primary'}`}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex-1 p-6 md:p-10 max-w-[1200px]">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card flex flex-col justify-center">
            <div className="font-mono text-[36px] font-bold text-text-primary leading-tight">24</div>
            <div className="text-[13px] text-text-secondary">tokens today</div>
          </div>
          <div className="card flex flex-col justify-center">
            <div className="font-mono text-[36px] font-bold text-text-primary leading-tight">11m</div>
            <div className="text-[13px] text-text-secondary">avg consult</div>
          </div>
          <div className="card flex flex-col justify-center">
            <div className="font-mono text-[36px] font-bold text-urgent leading-tight">+3 min</div>
            <div className="text-[13px] text-text-secondary">lag today</div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <button 
            onClick={handleCallNext}
            disabled={loadingCall}
            className="w-full sm:w-auto flex-1 btn-primary text-[16px] flex items-center justify-center gap-2 h-[56px]"
          >
            {loadingCall ? 'Calling...' : 'Call Next Patient →'}
          </button>
          <button className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 h-[56px]">
            <Plus className="w-5 h-5" /> Add Walk-in
          </button>
        </div>

        <hr className="border-border mb-8" />

        {/* QUEUE TABLE */}
        <div className="bg-white border border-border rounded-[12px] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">#</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Patient</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Priority</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Source</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">ETS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tokens.map((t) => {
                  const isActive = t.priority === 'active';
                  return (
                    <tr key={t.id} className={`transition-all ${isActive ? 'bg-primary-light' : 'hover:bg-bg cursor-pointer'}`}>
                      <td className={`px-6 py-4 font-mono font-bold ${isActive ? 'border-l-[3px] border-l-primary' : 'border-l-[3px] border-l-transparent'}`}>
                        {t.token_number}
                      </td>
                      <td className="px-6 py-4 text-[15px] font-medium text-text-primary">{t.patient_name}</td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          <div className="badge-routine border-primary-light bg-white text-primary w-fit"><Radio className="w-3 h-3" /> ACTIVE</div>
                        ) : t.priority === 'urgent' ? (
                          <div className="badge-urgent w-fit"><span className="text-[8px]">●</span> URGENT</div>
                        ) : (
                          <div className="badge-routine w-fit"><span className="text-[8px]">○</span> ROUTINE</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`px-2 py-1 rounded-[4px] text-[11px] font-medium w-fit ${t.source === 'online' ? 'bg-[#EEF2FF] text-[#6366F1]' : 'bg-accent-light text-accent'}`}>
                          {t.source}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {t.ets === 'NOW' ? (
                          <div className="px-2 py-1 rounded-[4px] text-[11px] font-medium bg-accent-light text-accent flex items-center gap-1.5 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-ring" /> NOW
                          </div>
                        ) : (
                          <span className="font-mono text-[14px] text-text-secondary">{t.ets}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
