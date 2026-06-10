'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ReceptionistDashboard() {
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    // Fetch doctors for this hospital
    if (session?.user) {
      const hospitalId = (session.user as any).hospital_id;
      fetch(`/api/hospitals?id=${hospitalId}`)
        .then(res => res.json())
        .then(data => {
          const hosp = data.find((h: any) => h.id === hospitalId);
          if (hosp) {
            setDoctors(hosp.doctors || []);
            if (hosp.doctors?.length > 0) setSelectedDoctorId(hosp.doctors[0].id);
          }
          setLoading(false);
        });
    }
  }, [session]);

  useEffect(() => {
    if (selectedDoctorId) {
      fetchQueue();
      const interval = setInterval(fetchQueue, 5000); // Poll every 5s for demo
      return () => clearInterval(interval);
    }
  }, [selectedDoctorId]);

  const fetchQueue = async () => {
    const res = await fetch(`/api/queue?doctorId=${selectedDoctorId}`);
    if (res.ok) {
      const data = await res.json();
      setQueue(data);
    }
  };

  const handleCallNext = async () => {
    setCalling(true);
    await fetch('/api/queue/call-next', {
      method: 'POST',
      body: JSON.stringify({ doctorId: selectedDoctorId }),
      headers: { 'Content-Type': 'application/json' }
    });
    await fetchQueue();
    setCalling(false);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Dashboard...</div>;

  const activeToken = queue.find(t => t.status === 'called');
  const waitingTokens = queue.filter(t => t.status === 'waiting');

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Receptionist Dashboard</h1>
        <div>
          <label style={{ marginRight: '1rem' }}>Active Doctor:</label>
          <select 
            value={selectedDoctorId} 
            onChange={e => setSelectedDoctorId(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px' }}
          >
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
          </select>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        <aside>
          <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
            <h3>Queue Stats</h3>
            <p><strong>Total Waiting:</strong> {waitingTokens.length}</p>
            <p><strong>Avg. Wait Time:</strong> ~22 mins</p>
          </div>

          <button 
            onClick={handleCallNext}
            disabled={calling || waitingTokens.length === 0}
            style={{ width: '100%', padding: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', marginBottom: '1rem' }}
          >
            {calling ? 'Calling...' : 'Call Next Patient'}
          </button>

          <button 
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            + Add Walk-in Patient
          </button>
        </aside>

        <main>
          {activeToken && (
            <div style={{ padding: '1.5rem', backgroundColor: '#e7f3ff', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '2rem' }}>
              <h2 style={{ marginTop: 0 }}>Currently Serving</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>#{activeToken.token_number}</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.2rem' }}><strong>{activeToken.patients?.name || 'Guest Patient'}</strong></p>
                  <p style={{ margin: 0, color: '#666' }}>{activeToken.patients?.phone || 'No phone'}</p>
                  <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', backgroundColor: '#ffc107', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.5rem' }}>{activeToken.priority}</span>
                </div>
              </div>
              <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '4px' }}>
                <strong>Symptoms:</strong> {activeToken.metadata?.symptoms || 'None provided'}
              </div>
            </div>
          )}

          <h3>Waiting Queue</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '0.5rem' }}>Token #</th>
                <th>Patient</th>
                <th>Priority</th>
                <th>Source</th>
                <th>ETS</th>
              </tr>
            </thead>
            <tbody>
              {waitingTokens.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}><strong>#{t.token_number}</strong></td>
                  <td>{t.patients?.name || 'Guest'}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.5rem', backgroundColor: t.priority === 'emergency' ? '#f8d7da' : t.priority === 'urgent' ? '#fff3cd' : '#d4edda', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {t.priority}
                    </span>
                  </td>
                  <td>{t.source}</td>
                  <td>{new Date(t.ets).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
              {waitingTokens.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No patients in queue</td></tr>}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
