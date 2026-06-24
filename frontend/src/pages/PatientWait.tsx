import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueService } from '../services/api';
import { Bell, ArrowRight } from 'lucide-react';

export default function PatientWait() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<any>({
    token_number: 47,
    status: 'waiting',
    ets: new Date(Date.now() + 38 * 60000).toISOString(),
    doctor_id: 'doc-123'
  });
  const [activeToken, setActiveToken] = useState<any>({ token_number: 44 });
  const [, setEvents] = useState<any[]>([]);

  // In a real app, we would fetch the token details using tokenId on mount.
  // We're mocking the initial state since the backend GET token isn't fully set up yet.

  useEffect(() => {
    if (!token?.doctor_id) return;
    
    const streamUrl = queueService.getStreamUrl(token.doctor_id);
    const eventSource = new EventSource(streamUrl);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CALL_NEXT') {
        setActiveToken({ token_number: data.tokenNumber });
        setEvents(prev => [...prev, data]);
        if (data.tokenId === tokenId) {
          // It's your turn
          setToken((prev: any) => ({ ...prev, status: 'called' }));
        }
      }
    };

    return () => eventSource.close();
  }, [token?.doctor_id, tokenId]);

  const diff = token.token_number - activeToken.token_number;
  const isTurn = token.status === 'called' || diff <= 0;

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-surface/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">City Hospital</h2>
              <p className="text-sm text-text-secondary">Dr. Priya Sharma</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-bg border border-white/10 flex items-center justify-center text-text-secondary">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-bg-dark p-8 text-center shadow-card overflow-hidden">
          <div className="text-[11px] uppercase tracking-[0.28em] text-text-secondary mb-3">Now serving</div>
          <div className="font-mono text-[84px] font-bold text-white leading-none"># {activeToken.token_number}</div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-surface/90 p-6 shadow-card">
          <div className="text-[11px] uppercase tracking-[0.28em] text-text-secondary mb-3">Your position</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => {
              const num = activeToken.token_number + i;
              const isMe = num === token.token_number;
              const isDone = num < activeToken.token_number;
              const isCurrent = num === activeToken.token_number;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-[64px] h-[48px] rounded-[16px] border px-3 py-2 flex flex-col items-center justify-center text-sm font-semibold ${isMe ? 'bg-accent/10 border-accent text-accent' : isCurrent ? 'bg-white border-primary text-text-primary' : isDone ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-text-secondary'}`}>
                    <span className="font-mono">{num}</span>
                    {isMe && <span className="text-[10px] font-medium">YOU</span>}
                  </div>
                  {i < 3 && <ArrowRight className="w-4 h-4 text-text-secondary" />}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-text-secondary text-center">
            {isTurn ? 'It is your turn now!' : `${Math.max(0, diff)} patients ahead of you`}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-surface/90 p-6 shadow-card">
          <div className="text-sm text-text-secondary mb-3">Your estimated time</div>
          <div className="rounded-[24px] bg-bg/80 p-6 text-center">
            <div className="font-mono text-[56px] font-bold text-white mb-2">
              {new Date(token.ets).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-sm text-text-secondary">About {Math.max(0, Math.round((new Date(token.ets).getTime() - Date.now()) / 60000))} minutes from now</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-surface/90 p-4 shadow-card flex items-center gap-3">
          <span className="relative inline-flex h-3 w-3 rounded-full bg-accent">
            <span className="absolute inset-0 rounded-full bg-accent opacity-70 animate-pulse-ring" />
          </span>
          <p className="text-sm text-text-secondary"><strong className="text-text-primary">Live</strong> · Updates automatically</p>
        </div>

        {!isTurn && diff > 2 && (
          <div className="rounded-[32px] border-l-4 border-warning bg-[#FFFBF0] p-5 text-text-primary">
            <p className="font-semibold">Wait feeling long?</p>
            <p className="text-sm text-text-secondary mt-1">A nearby clinic has 12 min wait for the same specialty.</p>
            <button onClick={() => navigate('/patient/switch')} className="mt-4 inline-flex items-center gap-2 text-primary font-semibold">
              Switch Hospital <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
