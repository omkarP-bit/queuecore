import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="font-sans text-text-primary bg-bg min-h-screen overflow-x-hidden">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary/15 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pb-32">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:w-6/12 space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-primary font-semibold">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live in Bangalore & Delhi
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-display font-bold tracking-[-0.04em] leading-tight text-white">
                  <span className="text-underline-blue">Skip</span> the <span className="text-emergency line-through decoration-[4px]">3-hour</span> <br /> waiting room.
                </h1>
                <p className="mt-6 max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed">
                  Book your token before you leave home. Know exactly when to arrive with live queue tracking and AI-powered triage.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/patient/find" className="btn-primary h-[56px] px-8 flex items-center justify-center gap-3 text-base">
                  Book a Token <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="btn-secondary h-[56px] px-8 text-base text-white/80">
                  Watch demo
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Partner Clinics', value: '200+' },
                  { label: 'Paper Replaced', value: '76%' },
                  { label: 'Avg Booking', value: '2.3m' },
                  { label: 'Patient Rating', value: '★ 4.8' },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-5 rounded-[24px] border border-white/10">
                    <p className="text-sm text-text-secondary uppercase tracking-[0.25em] mb-3">{item.label}</p>
                    <p className="text-3xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-5/12 relative">
              <div className="absolute -top-10 -right-14 h-[320px] w-[320px] rounded-full bg-primary/10 blur-[130px]" />
              <div className="glass-card relative overflow-hidden rounded-[40px] border border-white/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
                <div className="h-[420px] bg-[url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-text-secondary mb-2">Current Status</p>
                      <p className="text-lg font-semibold text-white">Apollo Clinic, Indiranagar</p>
                      <p className="text-sm text-text-secondary">Dr. Sanjay Verma • Cardiology</p>
                    </div>
                    <div className="badge-pill badge-available">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Live
                    </div>
                  </div>

                  <div className="bg-bg/70 border border-white/10 rounded-[28px] p-6 mb-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-text-secondary mb-2">Your token</p>
                        <p className="text-[4rem] font-mono font-bold text-white leading-none">#47</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.32em] text-text-secondary mb-2">Est. time</p>
                        <p className="text-2xl font-bold text-primary">~2:35 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>Queue progress</span>
                      <span className="text-white font-semibold">4 patients ahead</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={`h-2.5 rounded-full flex-1 ${index < 4 ? 'bg-primary/30' : 'bg-accent'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-white text-center mb-16">How it works</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {[
              { icon: '📱', title: 'Book token', label: 'Search & book online' },
              { icon: '🤖', title: 'AI triages', label: 'Analyzes symptoms' },
              { icon: '⏰', title: 'Get ETS', label: 'Know when to arrive' },
              { icon: '📡', title: 'Track live', label: 'Real-time updates' },
              { icon: '✅', title: 'Done', label: 'Zero waiting room' },
            ].map((step) => (
              <div key={step.title} className="glass-card rounded-[28px] p-8 text-center">
                <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-[28px] text-white">{step.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-bg px-6 py-16">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-4 border-t border-white/10 pt-10 text-text-secondary">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white text-xl font-display font-bold">
              <Zap className="w-6 h-6 text-primary" /> QueueCure
            </div>
            <p className="max-w-md text-sm text-text-secondary">Patient-first hospital queue platform for Indian OPDs. Calm confidence in a stressful environment.</p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/patient/find" className="hover:text-white">Find Hospital</Link></li>
              <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Privacy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="hover:text-white cursor-pointer">Support</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center text-sm text-[#94A3B8]">© 2024 QueueCure Technologies Pvt Ltd. All rights reserved.</div>
      </footer>
    </div>
  );
}
