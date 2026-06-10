'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function WaitingRoom() {
  const { token_id } = useParams();
  const [token, setToken] = useState<any>(null);
  const [activeTokenNumber, setActiveTokenNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch token details
    fetch(`/api/tokens/${token_id}`)
      .then(res => res.json())
      .then(data => {
        setToken(data);
        setLoading(false);
      });
  }, [token_id]);

  useEffect(() => {
    if (token?.doctor_id) {
      // 2. Connect to SSE
      const eventSource = new EventSource(`/api/queue/stream?doctorId=${token.doctor_id}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'CALL_NEXT') {
          setActiveTokenNumber(data.tokenNumber);
          if (data.tokenId === token_id) {
            setToken((prev: any) => ({ ...prev, status: 'called' }));
          }
        }
      };

      return () => eventSource.close();
    }
  }, [token?.doctor_id, token_id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Waiting Room...</div>;

  if (token.status === 'called') {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2rem', backgroundColor: '#e7f3ff', border: '2px solid #007bff', borderRadius: '12px' }}>
        <h1 style={{ color: '#007bff' }}>It's Your Turn!</h1>
        <p style={{ fontSize: '1.5rem' }}>Please proceed to <strong>{token.doctors?.name}'s</strong> consultation room.</p>
        <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>#{token.token_number}</div>
      </div>
    );
  }

  const tokensAhead = token.token_number - (activeTokenNumber || 0);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
      <h1>Waiting Room</h1>
      <p style={{ color: '#666' }}>{token.doctors?.hospitals?.name} • {token.doctors?.name}</p>
      
      <div style={{ margin: '2rem 0', padding: '2rem', border: '1px solid #ccc', borderRadius: '12px' }}>
        <p style={{ margin: 0, color: '#666' }}>Your Token</p>
        <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>#{token.token_number}</div>
        <div style={{ marginTop: '1rem' }}>
          {tokensAhead > 0 ? (
            <p style={{ fontSize: '1.2rem' }}><strong>{tokensAhead}</strong> patients ahead of you</p>
          ) : (
            <p style={{ fontSize: '1.2rem', color: '#ffc107' }}>You are next in queue!</p>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#666' }}>Estimated Time</p>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{new Date(token.ets).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <p style={{ margin: '0.5rem 0 0 0', color: '#28a745' }}>~22 mins wait</p>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#999' }}>
        Currently serving: #{activeTokenNumber || '---'}
      </div>
    </div>
  );
}
