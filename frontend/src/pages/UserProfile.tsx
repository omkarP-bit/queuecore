import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
      else {
        const localUser = localStorage.getItem('user');
        if (localUser) setUser(JSON.parse(localUser));
        else navigate('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans">
      <div className="max-w-2xl mx-auto rounded-[28px] border border-white/10 bg-surface/90 p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-white mb-6">Your Profile</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-6 border-b border-white/5 pb-6">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full shadow-sm" />
            ) : (
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.user_metadata?.full_name?.[0] || user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">{user?.user_metadata?.full_name || user?.name || 'Unknown User'}</h3>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-text-secondary mb-2">Account Details</h4>
            <div className="rounded-[16px] border border-white/5 bg-bg/80 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Role</span>
                <span className="font-medium text-white">{user?.role || 'Patient'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button onClick={handleLogout} className="btn-primary flex-1">Sign Out</button>
            <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
