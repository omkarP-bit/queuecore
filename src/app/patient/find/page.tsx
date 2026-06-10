'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import QRCode from 'qrcode';

export default function FindHospital() {
  const { data: session } = useSession();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [symptoms, setSymptoms] = useState('');
  const [triageResult, setTriageResult] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [triaging, setTriaging] = useState(false);

  useEffect(() => {
    fetch('/api/hospitals')
      .then(res => res.json())
      .then(data => {
        setHospitals(data);
        setLoading(false);
      });
  }, []);

  const handleTriage = async () => {
    setTriaging(true);
    const res = await fetch('/api/triage', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setTriageResult(data);
    setTriaging(false);
  };

  const handleBookToken = async () => {
    const res = await fetch('/api/tokens', {
      method: 'POST',
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        priority: triageResult.priority,
        symptoms: symptoms
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setToken(data);
    
    if (data.qrData) {
      const url = await QRCode.toDataURL(data.qrData);
      setQrUrl(url);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Hospitals...</div>;

  if (token) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2rem', border: '2px solid #28a745', borderRadius: '12px' }}>
        <h2 style={{ color: '#28a745' }}>Token Generated Successfully!</h2>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>#{token.token_number}</div>
        <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
        <p><strong>Estimated Start:</strong> {new Date(token.ets).toLocaleTimeString()}</p>
        <div style={{ margin: '2rem 0' }}>
          <img src={qrUrl} alt="Token QR Code" style={{ width: '200px' }} />
        </div>
        <p style={{ color: '#666' }}>Show this QR at the reception</p>
        <button onClick={() => window.print()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Print Token Slip</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Find a Hospital</h1>
      
      {!selectedHospital ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {hospitals.map(h => (
            <div key={h.id} onClick={() => setSelectedHospital(h)} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <h3>{h.name}</h3>
              <p style={{ color: '#666' }}>{h.city} • ⭐ {h.rating}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {h.specialty_tags?.map((t: string) => (
                  <span key={t} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#e9ecef', borderRadius: '10px' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !selectedDoctor ? (
        <div>
          <button onClick={() => setSelectedHospital(null)} style={{ marginBottom: '1rem' }}>← Back to Hospitals</button>
          <h2>Doctors at {selectedHospital.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {selectedHospital.doctors?.map((d: any) => (
              <div key={d.id} onClick={() => setSelectedDoctor(d)} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>
                <h3>{d.name}</h3>
                <p>{d.specialty}</p>
                <p style={{ color: '#28a745' }}>Avg. Consult: {d.avg_consult_minutes} mins</p>
                <button style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Book Token</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedDoctor(null)} style={{ marginBottom: '1rem' }}>← Back to Doctors</button>
          <h2>Booking with {selectedDoctor.name}</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Describe your symptoms:</label>
            <textarea 
              value={symptoms} 
              onChange={e => setSymptoms(e.target.value)} 
              rows={4} 
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="E.g. Mild fever since morning, headache..."
            />
          </div>

          {!triageResult ? (
            <button 
              onClick={handleTriage} 
              disabled={!symptoms || triaging}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {triaging ? 'Analyzing Symptoms...' : 'Analyze & Continue'}
            </button>
          ) : (
            <div style={{ padding: '1rem', border: '1px solid #28a745', borderRadius: '8px', backgroundColor: '#f4fff4' }}>
              <h3>AI Triage Result</h3>
              <p><strong>Priority:</strong> <span style={{ color: triageResult.priority === 'emergency' ? 'red' : triageResult.priority === 'urgent' ? 'orange' : 'green', fontWeight: 'bold', textTransform: 'uppercase' }}>{triageResult.priority}</span></p>
              <p><strong>Reason:</strong> {triageResult.reason}</p>
              <p><strong>Estimated Duration:</strong> {triageResult.estimated_consult_minutes} mins</p>
              
              <button 
                onClick={handleBookToken} 
                style={{ width: '100%', padding: '1rem', marginTop: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Confirm & Generate Token
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
