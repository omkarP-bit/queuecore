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
import Queue from './pages/Queue';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Navigate to="/receptionist" replace />} />
          <Route path="/queue" element={<Queue />} />
          
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
          <Route path="/patient/find" element={<HospitalDiscovery />} />

          {/* Protected routes — require login */}
          <Route path="/patient/book/:doctorId" element={<ProtectedRoute><SymptomTriage /></ProtectedRoute>} />
          <Route path="/patient/token/:tokenId" element={<ProtectedRoute><TokenConfirmation /></ProtectedRoute>} />
          <Route path="/patient/wait/:tokenId" element={<ProtectedRoute><PatientWait /></ProtectedRoute>} />
          <Route path="/patient/switch" element={<ProtectedRoute><HospitalSwitch /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
