import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
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
      const res = await authService.login({
        role: 'patient',
        email,
        name: tab === 'signup' ? name : '',
      });

      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate('/queue');
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="glass-card rounded-[32px] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8 bg-bg/70 border border-white/10 rounded-[24px] p-2">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 rounded-[18px] py-3 text-sm font-medium transition-all ${tab === 'login' ? 'bg-surface text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
              >
                Login
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 rounded-[18px] py-3 text-sm font-medium transition-all ${tab === 'signup' ? 'bg-surface text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
              >
                Signup
              </button>
            </div>

            {error && <div className="rounded-[20px] border border-emergency/30 bg-emergency/10 text-emergency px-4 py-3 mb-6 text-sm">{error}</div>}

            <form onSubmit={handleAuth} className="space-y-6">
              {tab === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="input-field pl-12"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="input-field pl-12"
                  />
                </div>
                {tab === 'login' && (
                  <div className="mt-3 text-right">
                    <button type="button" className="text-sm text-primary hover:text-primary/80">Forgot password?</button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full h-[56px] text-base font-semibold">
                {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create account'}
              </button>

              <div className="relative text-center text-sm text-text-secondary">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                <span className="relative bg-bg px-3">Or continue with</span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/queue` } });
                    if (error) setError(error.message);
                  } catch (e: any) {
                    setError(e.message || 'Error occurred');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full h-[56px] rounded-[16px] border border-border bg-bg text-white flex items-center justify-center gap-3 hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
            </form>
          </div>

          <div className="hidden lg:flex flex-col justify-center rounded-[32px] border border-white/10 bg-surface p-10 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.28em] text-text-secondary mb-3">QueueCure benefits</p>
              <h2 className="text-4xl font-display font-bold text-white">Reclaim waiting time with confidence.</h2>
            </div>

            <div className="space-y-5">
              <div className="glass-card rounded-[28px] p-5 flex items-start gap-4 border border-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Skip long queues</p>
                  <p className="text-sm text-text-secondary">Reserve your place remotely and reduce waiting room time.</p>
                </div>
              </div>
              <div className="glass-card rounded-[28px] p-5 flex items-start gap-4 border border-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Live status alerts</p>
                  <p className="text-sm text-text-secondary">Receive updates when your token is called and the queue moves.</p>
                </div>
              </div>
              <div className="glass-card rounded-[28px] p-5 flex items-start gap-4 border border-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Secure bookings</p>
                  <p className="text-sm text-text-secondary">Your information is handled safely and privately.</p>
                </div>
              </div>
            </div>

            <a href="/patient/find" className="mt-8 inline-flex items-center gap-2 text-primary font-semibold hover:text-white">
              Book your first appointment now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
