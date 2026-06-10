'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    govId: '',
    isComplete: false
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/patient/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          govId: '', // Never fetch the hash back
          isComplete: data.isComplete
        });
      }
      setLoading(false);
    }
    if (session) fetchProfile();
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/patient/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      setMessage('Profile updated successfully!');
      setProfile(prev => ({ ...prev, isComplete: !!(prev.name && prev.phone) }));
    } else {
      const error = await res.json();
      setMessage(`Error: ${error.error}`);
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Patient Profile</h1>
      
      {!profile.isComplete && (
        <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', color: '#856404', marginBottom: '1rem', borderRadius: '4px' }}>
          Complete profile for faster token generation
        </div>
      )}

      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '1rem' }}>
          <label display-block="true" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input 
            type="text" 
            value={profile.name} 
            onChange={e => setProfile({...profile, name: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone (Required)</label>
          <input 
            type="tel" 
            value={profile.phone} 
            onChange={e => setProfile({...profile, phone: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            value={profile.email} 
            disabled
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Gov ID (Optional) 
            <span title="Why we ask: We use this to verify your identity at the hospital and prevent duplicate tokens. It is stored as a secure hash." style={{ cursor: 'help', marginLeft: '0.5rem', color: '#007bff' }}>ⓘ</span>
          </label>
          <input 
            type="text" 
            value={profile.govId} 
            placeholder="Aadhar / PAN / Driving License"
            onChange={e => setProfile({...profile, govId: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
