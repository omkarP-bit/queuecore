import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        const res = await authService.login({ role: 'patient', email, name: '' });
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          navigate('/queue');
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        // Mock signup flow for now, reusing login
        const res = await authService.login({ role: 'patient', email, name });
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          navigate('/queue');
        } else {
          setError(res.error || 'Signup failed');
        }
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex w-full">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md bg-surface rounded-[32px] p-8 md:p-10 border border-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-10 bg-bg p-1.5 rounded-2xl">
              <button 
                onClick={() => setTab('login')}
                className={`flex-1 py-3 text-[15px] font-medium rounded-xl transition-all ${tab === 'login' ? 'bg-surface text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setTab('signup')}
                className={`flex-1 py-3 text-[15px] font-medium rounded-xl transition-all ${tab === 'signup' ? 'bg-surface text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
              >
                Signup
              </button>
            </div>

            {error && <div className="bg-emergency/10 border border-emergency/30 text-emergency p-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}
            
            <form onSubmit={handleAuth} className="space-y-5">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input 
                      type="text" value={name} onChange={e => setName(e.target.value)} required
                      className="w-full h-[52px] bg-bg border border-border rounded-[16px] pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input 
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full h-[52px] bg-bg border border-border rounded-[16px] pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input 
                    type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full h-[52px] bg-bg border border-border rounded-[16px] pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                {tab === 'login' && (
                  <div className="flex justify-end mt-2">
                    <a href="#" className="text-[13px] text-primary hover:text-primary-light transition-colors">Forgot Password?</a>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary h-[56px] mt-4 flex items-center justify-center gap-2 rounded-[16px] text-[16px]">
                {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <span className="relative bg-surface px-4 text-[13px] text-text-muted">or continue with</span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/queue` }});
                    if (error) setError(error.message);
                  } catch (e: any) {
                    setError(e.message || 'Error occurred');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full h-[56px] rounded-[16px] border border-border bg-bg text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-3 text-[15px] font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden lg:flex w-1/2 relative bg-surface overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg to-bg z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
          
          <div className="relative z-20 flex flex-col justify-center p-16 max-w-xl mx-auto w-full">
            <h2 className="text-[48px] font-display font-bold text-white leading-[1.1] mb-12">
              Join 100,000+ Patients Reclaiming Their Time
            </h2>
            
            <div className="space-y-6">
              <div className="bg-bg/60 backdrop-blur-[20px] border border-white/10 p-6 rounded-[24px] flex items-start gap-4 shadow-modal">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-white mb-1">Skip Long Queues</h4>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Book a token from home and know exactly when it's your turn. No more crowded waiting rooms.</p>
                </div>
              </div>

              <div className="bg-bg/60 backdrop-blur-[20px] border border-white/10 p-6 rounded-[24px] flex items-start gap-4 shadow-modal">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-white mb-1">Live Updates</h4>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Get real-time ETA and position updates. We'll notify you when it's time to leave for the clinic.</p>
                </div>
              </div>

              <div className="bg-bg/60 backdrop-blur-[20px] border border-white/10 p-6 rounded-[24px] flex items-start gap-4 shadow-modal">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-white mb-1">Secure & Private</h4>
                  <p className="text-[14px] text-text-secondary leading-relaxed">Your medical information and booking history is end-to-end encrypted and completely private.</p>
                </div>
              </div>
            </div>
            
            <a href="/patient/find" className="mt-12 text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all text-[15px]">
              Book your first appointment now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
