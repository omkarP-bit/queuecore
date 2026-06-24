import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [hospitalCode, setHospitalCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = role === 'receptionist' 
        ? { role, hospitalCode, password } 
        : { role, email, name };
        
      const res = await authService.login(payload);
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        if (role === 'receptionist') {
          navigate('/dashboard');
        } else {
          navigate('/queue');
        }
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] px-4 font-['Inter']">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-[#0D4F6C] mb-6">Login to QueueCore AI</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7B3FE4] outline-none transition-all"
            >
              <option value="patient">Patient</option>
              <option value="receptionist">Receptionist / Admin</option>
            </select>
          </div>
          
          {role === 'patient' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7B3FE4] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7B3FE4] outline-none transition-all"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Hospital Code</label>
                <input 
                  type="text" 
                  value={hospitalCode}
                  onChange={(e) => setHospitalCode(e.target.value)}
                  placeholder="Enter ID (e.g. h1)"
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7B3FE4] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7B3FE4] outline-none transition-all"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {role === 'patient' && (
            <div className="mt-6">
              <div className="relative mb-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-text-muted">or continue with</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/queue`,
                      },
                    });
                    if (error) {
                      setError(error.message);
                    }
                  } catch (e: any) {
                    setError(e.message || 'An error occurred during Google Auth');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full btn-secondary text-text-primary border-border hover:bg-bg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
