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
      if (session?.user) {
        setUser(session.user);
      } else {
        const localUser = localStorage.getItem('user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          navigate('/login');
        }
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

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-8 font-['Inter']">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-[#0D4F6C] mb-6">User Profile</h2>
        <div className="space-y-4 text-slate-700">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full shadow" />
            ) : (
              <div className="w-16 h-16 bg-[#7B3FE4] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.user_metadata?.full_name?.[0] || user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{user?.user_metadata?.full_name || user?.name || 'Unknown User'}</h3>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="font-semibold mb-2">Account Details</h4>
            <p><span className="font-medium">Role:</span> {user?.role || 'Patient'}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={() => navigate(-1)}
              className="ml-4 px-6 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
