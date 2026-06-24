import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueService } from '../services/api';
import { Bell, Check, ArrowRight } from 'lucide-react';

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
    <div className="max-w-md mx-auto min-h-screen bg-bg p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-text-primary text-[17px]">City Hospital</h2>
          <p className="text-text-secondary text-[13px]">Dr. Priya Sharma</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-text-secondary">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* NOW SERVING */}
      <div className="bg-bg-dark rounded-[16px] p-6 text-center shadow-card relative overflow-hidden">
        <div className="text-[11px] font-medium text-[#A0AEC0] tracking-wider mb-2">NOW SERVING</div>
        <div className="font-mono text-[80px] font-bold text-white leading-none animate-fade-down" key={activeToken.token_number}>
          # {activeToken.token_number}
        </div>
      </div>

      {/* YOUR POSITION */}
      <div>
        <div className="text-[11px] font-medium text-text-secondary tracking-wider mb-3">YOUR POSITION</div>
        <div className="flex items-center justify-between">
          {[...Array(4)].map((_, i) => {
            const num = activeToken.token_number + i;
            const isMe = num === token.token_number;
            const isDone = num < activeToken.token_number;
            const isCurrent = num === activeToken.token_number;

            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`
                  w-[64px] h-[48px] rounded-[8px] flex flex-col items-center justify-center border-[1.5px]
                  ${isDone ? 'bg-primary-light border-primary-light text-primary' : ''}
                  ${isCurrent ? 'bg-white border-primary text-text-primary' : ''}
                  ${!isDone && !isCurrent && !isMe ? 'bg-white border-border text-text-muted' : ''}
                  ${isMe ? 'bg-white border-accent text-accent relative' : ''}
                `}>
                  {isMe && !isTurn && (
                    <div className="absolute -inset-[2px] rounded-[10px] border-2 border-accent opacity-30 animate-pulse-ring" />
                  )}
                  <span className="font-mono font-bold text-[15px] flex items-center gap-1">
                    {num} {isDone && <Check className="w-3 h-3" />}
                  </span>
                  {isMe && <span className="text-[10px] font-medium">YOU</span>}
                  {isDone && <span className="text-[10px] font-medium">done</span>}
                </div>
                {i < 3 && <ArrowRight className="w-4 h-4 text-border" />}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[13px] text-text-secondary text-center">
          {isTurn ? 'It is your turn now!' : `${Math.max(0, diff)} patients ahead of you`}
        </div>
      </div>

      <hr className="border-border my-2" />

      {/* ETS */}
      <div>
        <div className="text-[13px] text-text-secondary mb-2">Your estimated time</div>
        <div className="card text-center p-6 bg-white">
          <div className="font-mono text-[52px] font-bold text-primary leading-none mb-2">
            {new Date(token.ets).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[13px] text-text-secondary">
            About {Math.max(0, Math.round((new Date(token.ets).getTime() - Date.now()) / 60000))} minutes from now
          </div>
        </div>
      </div>

      <hr className="border-border my-2" />

      {/* Live Indicator */}
      <div className="flex items-center gap-3 px-2">
        <div className="pulse-ring-container w-3 h-3">
          <div className="pulse-ring-element bg-accent" />
          <div className="w-2 h-2 rounded-full bg-accent relative z-10" />
        </div>
        <span className="text-[13px] text-text-secondary">
          <strong className="text-text-primary">Live</strong> · Updates automatically
        </span>
      </div>

      {/* Switch Suggestion */}
      {!isTurn && diff > 2 && (
        <div className="bg-[#FFFBF0] border-l-4 border-warning rounded-r-[12px] p-4 mt-2">
          <p className="text-[13px] font-medium text-text-primary mb-1">Wait feeling long?</p>
          <p className="text-[13px] text-text-secondary mb-3">A nearby clinic has 12 min wait for the same specialty</p>
          <button 
            onClick={() => navigate('/patient/switch')}
            className="text-[13px] font-medium text-primary flex items-center gap-1 hover:text-primary-dark"
          >
            Switch Hospital <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
