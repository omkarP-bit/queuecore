import { useState } from 'react';
import { Plus, ChevronDown, Radio } from 'lucide-react';

export default function ReceptionistDashboard() {
  const [tokens, setTokens] = useState<any[]>([
    { id: '1', token_number: 42, patient_name: 'R. Sharma', priority: 'active', source: 'online', ets: 'NOW' },
    { id: '2', token_number: 43, patient_name: 'P. Gupta', priority: 'urgent', source: 'walk-in', ets: '2:30 PM' },
    { id: '3', token_number: 44, patient_name: 'A. Mehta', priority: 'routine', source: 'online', ets: '3:00 PM' },
  ]);
  const [loadingCall, setLoadingCall] = useState(false);

  const handleCallNext = async () => {
    setLoadingCall(true);
    try {
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
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans">
      <div className="max-w-[1200px] mx-auto grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[32px] border border-white/10 bg-surface/90 p-6 shadow-card">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏥</span>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-text-secondary">Hospital</p>
                <p className="text-lg font-semibold text-white">City Hospital</p>
              </div>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-bg/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text-primary">Dr. Priya Sharma</p>
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {['Dashboard', 'Patients', 'Reports', 'Settings'].map((item, i) => (
              <button
                key={item}
                className={`w-full text-left rounded-[18px] px-4 py-3 text-sm font-medium transition ${i === 0 ? 'bg-primary text-bg' : 'text-text-secondary hover:bg-white/10 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[28px] bg-surface/90 border border-white/10 p-6">
              <p className="text-sm text-text-secondary uppercase tracking-[0.24em] mb-3">Tokens today</p>
              <p className="text-4xl font-semibold text-white">24</p>
            </div>
            <div className="rounded-[28px] bg-surface/90 border border-white/10 p-6">
              <p className="text-sm text-text-secondary uppercase tracking-[0.24em] mb-3">Avg consult</p>
              <p className="text-4xl font-semibold text-white">11m</p>
            </div>
            <div className="rounded-[28px] bg-surface/90 border border-white/10 p-6">
              <p className="text-sm text-text-secondary uppercase tracking-[0.24em] mb-3">Lag today</p>
              <p className="text-4xl font-semibold text-urgent">+3 min</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button onClick={handleCallNext} disabled={loadingCall} className="btn-primary flex-1 h-[56px] text-[16px] font-semibold">
              {loadingCall ? 'Calling...' : 'Call Next Patient →'}
            </button>
            <button className="btn-secondary flex-1 h-[56px] text-[16px] font-semibold">
              <Plus className="w-5 h-5" /> Add Walk-in
            </button>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-surface/90 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg border-b border-white/10">
                    <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">#</th>
                    <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Patient</th>
                    <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Priority</th>
                    <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">Source</th>
                    <th className="px-6 py-4 text-[13px] font-medium text-text-secondary">ETS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tokens.map((t) => {
                    const isActive = t.priority === 'active';
                    return (
                      <tr key={t.id} className={`transition-all ${isActive ? 'bg-primary/10' : 'hover:bg-white/5 cursor-pointer'}`}>
                        <td className={`px-6 py-4 font-mono font-bold ${isActive ? 'border-l-[3px] border-l-primary' : 'border-l-[3px] border-l-transparent'}`}>{t.token_number}</td>
                        <td className="px-6 py-4 text-[15px] font-medium text-white">{t.patient_name}</td>
                        <td className="px-6 py-4">
                          {isActive ? (
                            <span className="badge-routine border-primary-light bg-white text-primary w-fit"><Radio className="w-3 h-3" /> ACTIVE</span>
                          ) : t.priority === 'urgent' ? (
                            <span className="badge-urgent w-fit"><span className="text-[8px]">●</span> URGENT</span>
                          ) : (
                            <span className="badge-routine w-fit"><span className="text-[8px]">○</span> ROUTINE</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-[4px] text-[11px] font-medium w-fit ${t.source === 'online' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>{t.source}</span>
                        </td>
                        <td className="px-6 py-4">
                          {t.ets === 'NOW' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-accent/10 px-2 py-1 text-[11px] text-accent">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-ring" /> NOW
                            </span>
                          ) : (
                            <span className="font-mono text-[14px] text-text-secondary">{t.ets}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
