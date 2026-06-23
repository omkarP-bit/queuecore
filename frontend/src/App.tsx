import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState<'patient' | 'receptionist'>('patient');
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [doctorId, setDoctorId] = useState('test');

  useEffect(() => {
    // SSE Stream for live updates
    const eventSource = new EventSource(`https://queuecure.yourdomain.com/api/queue/stream?doctor_id=${doctorId}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.heartbeat) return; // ignore keepalive
      setQueueStatus(data);
    };

    return () => {
      eventSource.close();
    };
  }, [doctorId]);

  const handleCallNext = async () => {
    // Mock API call to queue service
    alert('Called Next Patient! (Backend not connected directly yet)');
    // In real app, you would make a POST to /queue/call-next
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>QueueCure</h1>
        <div className="view-switcher">
          <button 
            className={view === 'patient' ? 'active' : ''} 
            onClick={() => setView('patient')}
          >
            Patient View
          </button>
          <button 
            className={view === 'receptionist' ? 'active' : ''} 
            onClick={() => setView('receptionist')}
          >
            Receptionist View
          </button>
        </div>
      </header>

      <main className="app-main">
        {view === 'patient' ? (
          <div className="patient-dashboard">
            <h2>Your Wait Status</h2>
            <div className="status-card">
              <div className="status-item">
                <span className="label">Your Position:</span>
                <span className="value highlight">{queueStatus?.position || '2'}</span>
              </div>
              <div className="status-item">
                <span className="label">Estimated Time:</span>
                <span className="value">{queueStatus?.ets || '15 mins'}</span>
              </div>
              <div className="status-item">
                <span className="label">Currently Serving:</span>
                <span className="value">{queueStatus?.currentlyServing || 'Token 42'}</span>
              </div>
            </div>
            <p className="sse-note">Live updates active via SSE...</p>
          </div>
        ) : (
          <div className="receptionist-dashboard">
            <h2>Doctor Queue Manager</h2>
            <div className="control-panel">
              <div className="current-patient">
                <h3>Currently Serving: {queueStatus?.currentlyServing || 'Token 42'}</h3>
                <p>Time elapsed: 5m 30s</p>
              </div>
              <button className="call-next-btn" onClick={handleCallNext}>
                Call Next Patient
              </button>
            </div>
            <div className="queue-list">
              <h3>Next in Line</h3>
              <ul>
                <li>Token 43 - Expected 10:15 AM</li>
                <li>Token 44 - Expected 10:25 AM</li>
                <li>Token 45 - Expected 10:35 AM</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
