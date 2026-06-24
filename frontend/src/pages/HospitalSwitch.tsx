import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export default function HospitalSwitch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans flex items-center justify-center">
      <div className="w-full max-w-[520px] rounded-[32px] border border-white/10 bg-surface/90 p-6 shadow-modal animate-fade-up">
        <div className="mb-6 space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Shorter wait options</p>
          <h2 className="font-display text-3xl font-semibold text-white">Switch to a faster clinic</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            City Hospital wait is long. These nearby Cardiology clinics can get you seen sooner.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative rounded-[28px] border border-white/10 bg-bg/80 p-5 cursor-pointer hover:-translate-y-1 hover:shadow-float transition-all">
            <div className="absolute top-0 left-0 bg-accent text-black text-[10px] font-bold tracking-wider px-2 py-1 rounded-br-[8px] flex items-center gap-1">
              <Check className="w-3 h-3" /> RECOMMENDED
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-[16px] text-white mb-1">Jehangir Hospital · 1.2 km away</h3>
              <p className="text-[14px] text-text-secondary mb-3">Dr. Amit Joshi · Cardiology</p>
              <div className="flex items-center justify-between text-[13px] font-medium">
                <span className="text-white">3 patients waiting</span>
                <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded-[4px]">ETS: 18 min</span>
              </div>
              <button className="w-full mt-4 btn-primary text-[14px] font-semibold flex items-center justify-center gap-2">
                Switch Here <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-bg/80 p-5 cursor-pointer hover:-translate-y-1 hover:shadow-float transition-all">
            <h3 className="font-semibold text-[16px] text-white mb-1">Ruby Hall Clinic · 2.8 km away</h3>
            <p className="text-[14px] text-text-secondary mb-3">Dr. Sneha Kulkarni · Cardiology</p>
            <div className="flex items-center justify-between text-[13px] font-medium">
              <span className="text-white">6 patients waiting</span>
              <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded-[4px]">ETS: 31 min</span>
            </div>
            <button className="w-full mt-4 btn-primary text-[14px] font-semibold flex items-center justify-center gap-2">
              Switch Here <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button onClick={() => navigate(-1)} className="w-full btn-secondary text-[15px]">
          Keep my current spot
        </button>
      </div>
    </div>
  );
}
