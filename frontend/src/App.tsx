import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PatientWait from './pages/PatientWait';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import HospitalDiscovery from './pages/HospitalDiscovery';
import SymptomTriage from './pages/SymptomTriage';
import TokenConfirmation from './pages/TokenConfirmation';
import HospitalSwitch from './pages/HospitalSwitch';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Navigate to="/receptionist" replace />} />
          <Route path="/queue" element={<Navigate to="/patient/find" replace />} />
          
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
          <Route path="/patient/find" element={<HospitalDiscovery />} />
          <Route path="/patient/book/:doctorId" element={<SymptomTriage />} />
          <Route path="/patient/token/:tokenId" element={<TokenConfirmation />} />
          <Route path="/patient/wait/:tokenId" element={<PatientWait />} />
          <Route path="/patient/switch" element={<HospitalSwitch />} />
          <Route path="/profile" element={<UserProfile />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
