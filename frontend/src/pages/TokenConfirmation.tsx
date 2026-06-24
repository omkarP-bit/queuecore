import { useState, useEffect } from 'react';
import { Check, Bell, Printer, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TokenConfirmation() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 2 seconds
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Mock Confetti via CSS */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full animate-fade-down relative">
            {/* Simple CSS shapes for confetti effect */}
            <div className="absolute top-10 left-1/4 w-3 h-3 bg-primary rounded-sm transform rotate-45" />
            <div className="absolute top-20 right-1/4 w-3 h-3 bg-accent rounded-full" />
            <div className="absolute top-1/4 left-1/3 w-2 h-4 bg-urgent rounded-sm transform -rotate-12" />
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary rounded-sm transform rotate-12" />
          </div>
        </div>
      )}

      <div className="max-w-[420px] w-full flex flex-col items-center">
        <div className="flex items-center gap-2 text-accent font-medium text-[17px] mb-6">
          <Check className="w-5 h-5" /> Confirmed
        </div>

        {/* TICKET CARD */}
        <div className="w-full bg-white rounded-[16px] relative shadow-float mb-8 border border-transparent [background-clip:padding-box] before:absolute before:inset-0 before:-z-10 before:p-[2px] before:rounded-[16px] before:bg-gradient-to-br before:from-primary before:to-accent">
          
          <div className="p-6">
            <div className="text-[11px] font-medium tracking-[0.1em] text-text-secondary mb-6">QUEUECURE TOKEN</div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="font-mono font-bold text-[96px] text-primary leading-[0.8]">
                #<span className="ml-[-8px]">47</span>
              </div>
              <div className="text-right">
                <div className="font-display font-semibold text-[15px] text-text-primary">Dr. P. Sharma</div>
                <div className="text-[13px] text-text-secondary">Cardiology</div>
                <div className="text-[13px] text-text-secondary">City Hospital</div>
              </div>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="relative h-0 border-t-2 border-dashed border-border flex items-center mx-6">
            <div className="absolute -left-9 w-6 h-6 rounded-full bg-bg" />
            <div className="absolute -right-9 w-6 h-6 rounded-full bg-bg" />
          </div>

          <div className="p-6">
            <div className="flex justify-between mb-8">
              <div>
                <div className="text-[13px] text-text-secondary mb-1">Come by:</div>
                <div className="font-mono text-[28px] text-accent font-bold leading-tight">2:45 PM today</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] text-text-secondary mb-1">Priority:</div>
                <div className="font-medium text-urgent">Urgent</div>
              </div>
            </div>

            {/* Mock QR Code Container */}
            <div className="w-full h-[120px] bg-[#F7F8FA] border border-border rounded-[8px] flex items-center justify-center mb-6">
              <div className="text-text-muted text-[13px]">[ QR CODE ]</div>
            </div>

            <div className="text-center text-[13px] text-text-secondary">
              R. Sharma · Token valid for today only
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/patient/wait/12345')}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" /> Track Live Queue
            </button>
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" /> Print Slip
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="text-[13px] text-text-secondary">Add to calendar:</span>
            <button className="text-[13px] font-medium text-primary hover:underline flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" /> Google
            </button>
            <button className="text-[13px] font-medium text-primary hover:underline flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" /> iCal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
