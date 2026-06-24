import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export default function HospitalSwitch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg p-4 flex items-end md:items-center justify-center font-sans">
      {/* Bottom sheet mobile, modal desktop */}
      <div className="w-full max-w-[480px] bg-white rounded-t-[20px] md:rounded-[20px] p-6 shadow-modal animate-fade-up">
        
        <h2 className="font-display font-semibold text-[21px] text-text-primary mb-4">Shorter waits nearby</h2>
        <p className="text-[15px] text-text-secondary mb-6 leading-relaxed">
          The queue at City Hospital is running long. Here are faster options for Cardiology:
        </p>

        <div className="space-y-4 mb-6">
          {/* Card 1 - Recommended */}
          <div className="card border-2 border-accent relative p-5 cursor-pointer hover:-translate-y-1 hover:shadow-float transition-all">
            <div className="absolute top-0 left-0 bg-accent text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-br-[8px] flex items-center gap-1">
              <Check className="w-3 h-3" /> RECOMMENDED
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-[16px] text-text-primary mb-1">Jehangir Hospital · 1.2 km away</h3>
              <p className="text-[14px] text-text-secondary mb-3">Dr. Amit Joshi · Cardiology</p>
              <div className="flex items-center justify-between text-[13px] font-medium">
                <span className="text-text-primary">3 patients waiting</span>
                <span className="text-primary font-mono bg-primary-light px-2 py-1 rounded-[4px]">ETS: 18 min</span>
              </div>
              <button className="w-full mt-4 text-[14px] font-semibold text-primary flex items-center justify-center gap-1 hover:text-primary-dark">
                Switch Here <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card p-5 cursor-pointer hover:-translate-y-1 hover:shadow-float transition-all">
            <h3 className="font-semibold text-[16px] text-text-primary mb-1">Ruby Hall Clinic · 2.8 km away</h3>
            <p className="text-[14px] text-text-secondary mb-3">Dr. Sneha Kulkarni · Cardiology</p>
            <div className="flex items-center justify-between text-[13px] font-medium">
              <span className="text-text-primary">6 patients waiting</span>
              <span className="text-primary font-mono bg-primary-light px-2 py-1 rounded-[4px]">ETS: 31 min</span>
            </div>
            <button className="w-full mt-4 text-[14px] font-semibold text-primary flex items-center justify-center gap-1 hover:text-primary-dark">
              Switch Here <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          className="w-full btn-ghost text-[15px]"
        >
          Keep my current spot
        </button>

      </div>
    </div>
  );
}
