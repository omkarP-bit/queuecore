import { useState, useEffect } from 'react';
import { hospitalService, queueService } from '../services/api';
import { Plus, Activity } from 'lucide-react';

export default function Dashboard() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [lastCalled, setLastCalled] = useState<any>(null);

  useEffect(() => {
    hospitalService.getHospitals().then(data => {
      setHospitals(data || []);
      setLoading(false);
      // Select first doctor by default if available
      if (data && data[0]?.doctors?.[0]) {
        setSelectedDoctorId(data[0].doctors[0].id);
      }
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleCallNext = async () => {
    if (!selectedDoctorId) return;
    try {
      const res = await queueService.callNext(selectedDoctorId);
      if (res.success) {
        setLastCalled(res.nextToken);
      } else {
        alert(res.error || 'No more patients in queue');
      }
    } catch (err) {
      alert('Error calling next patient');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage queues and doctors</p>
        </div>
        <button 
          onClick={handleCallNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Call Next Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-700">Last Called Token</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {lastCalled ? `Token #${lastCalled.token_number}` : '--'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Priority: {lastCalled?.priority || '--'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Available Doctors</h2>
        <select 
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-6"
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
      </div>
    </div>
  );
}
