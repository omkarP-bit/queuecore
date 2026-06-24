import { useState, useEffect } from 'react';
import { hospitalService, queueService } from '../services/api';

export default function Queue() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [token, setToken] = useState<any>(null);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    hospitalService.getHospitals().then(data => {
      setHospitals(data || []);
      if (data && data[0]?.doctors?.[0]) {
        setSelectedDoctorId(data[0].doctors[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!token || !selectedDoctorId) return;
    
    const streamUrl = queueService.getStreamUrl(selectedDoctorId);
    const eventSource = new EventSource(streamUrl);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CALL_NEXT') {
        setEvents(prev => [...prev, `Token #${data.tokenNumber} called.`]);
        if (data.tokenId === token.id) {
          alert("It's your turn!");
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, [token, selectedDoctorId]);

  const handleCreateToken = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) {
        alert("Please login first!");
        return;
      }
      const data = await queueService.createToken({
        doctorId: selectedDoctorId,
        priority: 'routine',
        symptoms: 'Checkup',
        userId: user.id
      });
      if (data.error) {
        alert(data.error);
      } else {
        setToken(data);
      }
    } catch (err) {
      alert("Failed to create token.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Queue Tracker</h1>
      
      {!token ? (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            {hospitals.map(hospital => (
              <optgroup key={hospital.id} label={hospital.name}>
                {hospital.doctors?.map((doc: any) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button 
            onClick={handleCreateToken}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Generate Token
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-widest">Your Token</p>
            <h2 className="text-5xl font-bold text-blue-900 mt-2">#{token.token_number}</h2>
            <p className="text-gray-500 mt-2">Estimated Time: {new Date(token.ets).toLocaleTimeString()}</p>
          </div>
          
          <div className="mt-8">
            <h3 className="font-semibold text-gray-700 mb-2">Live Updates</h3>
            <div className="bg-gray-50 p-4 rounded-lg h-48 overflow-y-auto space-y-2">
              {events.length === 0 ? (
                <p className="text-gray-400 text-sm">Waiting for updates...</p>
              ) : (
                events.map((ev, i) => (
                  <div key={i} className="text-sm p-2 bg-white border border-gray-100 rounded shadow-sm">
                    {ev}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
