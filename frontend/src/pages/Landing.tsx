import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="font-sans text-text-primary bg-bg w-full overflow-x-hidden">
      {/* SECTION 1: NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md w-full border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary fill-current" />
          <span className="text-xl font-display font-bold text-text-primary">QueueCure</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/patient/find" className="text-text-secondary font-medium text-[15px] hover:text-primary transition-colors">Find Hospital</Link>
          <a href="#" className="text-text-secondary font-medium text-[15px] hover:text-primary transition-colors">How it works</a>
          <Link to="/login" className="text-text-secondary font-medium text-[15px] hover:text-primary transition-colors">Sign In</Link>
        </div>
        <div>
          <Link to="/patient/find" className="btn-primary flex items-center gap-2 h-[42px] px-5 text-[14px]">
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* SECTION 2: HERO */}
      <section className="pt-24 pb-16 px-6 max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        {/* LEFT */}
        <div className="lg:w-1/2 flex flex-col items-start z-10">
          <div className="text-[14px] font-medium text-text-secondary mb-6 tracking-wide uppercase">
            Trusted by 200+ clinics in Pune & Mumbai
          </div>
          <h1 className="text-[56px] md:text-[72px] font-display font-bold text-text-primary leading-[1.05] mb-8">
            <span className="relative inline-block">
              <span className="relative z-10">Skip</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10" />
            </span> the <br/>
            <span className="relative inline-block text-text-muted">
              3-hour
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-emergency -translate-y-1/2 -rotate-2" />
            </span> <br/>
            waiting room.
          </h1>
          <p className="text-[18px] md:text-[21px] text-text-secondary mb-10 max-w-lg leading-relaxed">
            Book your token before you leave home. Know exactly when to arrive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/patient/find" className="btn-primary h-[56px] px-8 text-[17px] flex items-center justify-center gap-2">
              Book a Token <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-secondary h-[56px] px-8 text-[17px] flex items-center justify-center gap-2 border-border text-text-primary hover:bg-white">
              Watch demo
            </button>
          </div>
        </div>

        {/* RIGHT: Live Demo Card */}
        <div className="lg:w-1/2 w-full max-w-[440px] relative z-10">
          {/* Decorative blurred blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -z-10" />
          
          <div className="card shadow-modal p-8 border-t-4 border-t-primary animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-[24px]">🏥</div>
              <div>
                <div className="font-display font-bold text-[17px] text-text-primary">City Hospital</div>
                <div className="text-[14px] text-text-secondary">Dr. Priya Sharma · Cardiology</div>
              </div>
            </div>

            <div className="bg-bg-dark rounded-[16px] p-6 text-center shadow-card relative overflow-hidden mb-6">
              <div className="text-[11px] font-medium text-[#A0AEC0] tracking-wider mb-2">NOW SERVING</div>
              <div className="font-mono text-[80px] font-bold text-white leading-none"># 47</div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-medium text-text-secondary">Your turn:</div>
              <div className="font-mono text-[20px] font-bold text-primary">~2:35 PM</div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i === 4 ? 'bg-accent relative' : 'bg-primary-light'}`}>
                    {i === 4 && <div className="absolute -inset-1 border border-accent rounded-full animate-pulse-ring" />}
                  </div>
                ))}
              </div>
              <div className="text-[13px] font-medium text-text-secondary">Pos 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS BAR */}
      <section className="bg-bg-dark py-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          <div className="flex flex-col px-4 text-center">
            <div className="font-mono text-[48px] font-bold text-white mb-2">200+</div>
            <div className="text-[13px] text-text-muted">Clinics onboarded</div>
          </div>
          <div className="flex flex-col px-4 text-center">
            <div className="font-mono text-[48px] font-bold text-white mb-2">76%</div>
            <div className="text-[13px] text-text-muted">Paper clinics replaced</div>
          </div>
          <div className="flex flex-col px-4 text-center">
            <div className="font-mono text-[48px] font-bold text-white mb-2">2.3m</div>
            <div className="text-[13px] text-text-muted">Avg token booking</div>
          </div>
          <div className="flex flex-col px-4 text-center">
            <div className="font-mono text-[48px] font-bold text-white mb-2">★ 4.8</div>
            <div className="text-[13px] text-text-muted">Patient rating</div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto text-center">
        <h2 className="font-display font-bold text-[36px] text-text-primary mb-16">How It Works</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between relative gap-8">
          {/* Dashed connecting line */}
          <div className="hidden md:block absolute top-[40px] left-10 right-10 h-0 border-t-2 border-dashed border-primary-light -z-10" />
          
          <div className="flex flex-col items-center bg-bg w-[180px]">
            <div className="w-20 h-20 rounded-full bg-white border border-border flex items-center justify-center mb-4 text-[32px] shadow-sm">📱</div>
            <div className="font-medium text-[15px] text-text-primary mb-1">Book token</div>
            <div className="text-[13px] text-text-secondary">Search & book online</div>
          </div>
          
          <div className="flex flex-col items-center bg-bg w-[180px]">
            <div className="w-20 h-20 rounded-full bg-white border border-border flex items-center justify-center mb-4 text-[32px] shadow-sm relative">
              <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-white" />
              🤖
            </div>
            <div className="font-medium text-[15px] text-text-primary mb-1">AI triages</div>
            <div className="text-[13px] text-text-secondary">Analyzes symptoms</div>
          </div>
          
          <div className="flex flex-col items-center bg-bg w-[180px]">
            <div className="w-20 h-20 rounded-full bg-white border border-border flex items-center justify-center mb-4 text-[32px] shadow-sm">⏰</div>
            <div className="font-medium text-[15px] text-text-primary mb-1">Get ETS</div>
            <div className="text-[13px] text-text-secondary">Know when to arrive</div>
          </div>
          
          <div className="flex flex-col items-center bg-bg w-[180px]">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-primary flex items-center justify-center mb-4 text-[32px] shadow-sm relative">
              <div className="absolute inset-0 rounded-full border border-primary animate-pulse-ring" />
              📡
            </div>
            <div className="font-medium text-[15px] text-primary mb-1">Track live</div>
            <div className="text-[13px] text-text-secondary">Real-time updates</div>
          </div>
          
          <div className="flex flex-col items-center bg-bg w-[180px]">
            <div className="w-20 h-20 rounded-full bg-accent-light text-accent flex items-center justify-center mb-4 shadow-sm"><Check className="w-8 h-8" /></div>
            <div className="font-medium text-[15px] text-text-primary mb-1">Done</div>
            <div className="text-[13px] text-text-secondary">Zero waiting room</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bg-dark text-white py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary fill-current" />
              <span className="text-xl font-display font-bold">QueueCure</span>
            </div>
            <p className="text-[#A0AEC0] text-[15px] max-w-sm">Patient-first hospital queue platform for Indian OPDs. Calm confidence in a stressful environment.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product Links</h4>
            <ul className="space-y-3 text-[14px] text-[#A0AEC0]">
              <li><Link to="/patient/find" className="hover:text-white">Find Hospital</Link></li>
              <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-[14px] text-[#A0AEC0]">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[13px] text-[#4A5568]">
          Built for Wooble Hackathon · Team Omkar, Apurv, Kushal
        </div>
      </footer>
    </div>
  );
}
