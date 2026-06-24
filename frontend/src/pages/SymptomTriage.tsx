import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { triageService, queueService } from '../services/api';

export default function SymptomTriage() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [symptoms, setSymptoms] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  
  const commonSymptoms = ['Chest pain', 'Shortness of breath', 'Fatigue', 'Palpitations'];

  const handleAnalyze = async () => {
    if (!symptoms) return;
    setLoading(true);
    try {
      const result = await triageService.getTriage(symptoms);
      setTriageResult(result);
      setAnalyzed(true);
    } catch (e) {
      setTriageResult({
        priority: 'routine',
        reason: 'Automated fallback due to error',
        estimated_consult_minutes: 15
      });
      setAnalyzed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) {
        navigate('/login');
        return;
      }
      
      const res = await queueService.createToken({
        patientId: user.id,
        doctorId: doctorId || 'doc-123',
        priority: triageResult?.priority || 'routine',
        symptoms: symptoms
      });
      
      if (res.token) {
        navigate(`/patient/token/${res.token.id}`);
      } else {
        // Fallback for demo
        navigate('/patient/token/12345');
      }
    } catch (e) {
      navigate('/patient/token/12345');
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 font-sans">
      <div className="max-w-[600px] mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 text-[15px] font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <div className="text-[13px] text-text-secondary font-medium tracking-wider mb-2 uppercase">Step 2 of 3</div>
        
        <div className="card mb-6">
          <h2 className="font-display font-semibold text-[21px] text-text-primary mb-1">Dr. Priya Sharma</h2>
          <p className="text-[15px] text-text-secondary">Cardiology · City Hospital</p>
        </div>

        {!analyzed ? (
          <div className="card">
            <h3 className="font-display font-semibold text-[17px] text-text-primary mb-4">"What brings you in today?"</h3>
            
            <div className="relative mb-2">
              <textarea 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="input-field h-auto py-4 min-h-[120px] resize-none"
                placeholder="Describe your symptoms in your own words. The more detail, the better your queue priority."
              />
            </div>
            <div className="text-right text-[11px] text-text-muted mb-6">Characters: {symptoms.length} / 500</div>
            
            <div className="mb-8">
              <p className="text-[13px] text-text-secondary mb-3">Common symptoms (tap to add):</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSymptoms(prev => prev ? `${prev}, ${s}` : s)}
                    className="bg-white border border-border px-3 py-1.5 rounded-full text-[13px] text-text-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={handleAnalyze} disabled={loading || !symptoms} className="btn-primary w-full text-[16px] disabled:opacity-50">
              {loading ? 'Analysing your symptoms...' : 'Analyse Symptoms →'}
            </button>
          </div>
        ) : (
          <div className={`border-l-4 rounded-[12px] p-6 shadow-card ${
            triageResult?.priority === 'emergency' ? 'bg-[#FFF0F0] border-l-emergency' :
            triageResult?.priority === 'urgent' ? 'bg-[#FFF8F4] border-l-urgent' :
            'bg-[#F7F8FA] border-l-border'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-[17px] text-text-primary">AI Triage Complete</h3>
              <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center"><Check className="w-4 h-4" /></div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[13px] text-text-secondary">Priority:</span>
              <div className={
                triageResult?.priority === 'emergency' ? 'badge-emergency rounded-full px-3 py-1 text-[13px]' :
                triageResult?.priority === 'urgent' ? 'badge-urgent rounded-full px-3 py-1 text-[13px]' :
                'badge-routine rounded-full px-3 py-1 text-[13px]'
              }>
                <span className="text-[10px]">{triageResult?.priority === 'routine' ? '○' : '●'}</span> {triageResult?.priority?.toUpperCase()}
              </div>
            </div>
            
            <p className="italic text-text-secondary text-[15px] mb-6 leading-relaxed">
              "{triageResult?.reason}"
            </p>
            
            <div className="space-y-2 mb-8">
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-text-secondary">Est. consult time:</span>
                <span className="font-medium text-text-primary">~{triageResult?.estimated_consult_minutes || 15} minutes</span>
              </div>
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-text-secondary">Your estimated wait:</span>
                <span className="font-medium text-text-primary">2:45 PM</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirm} className="btn-primary w-full h-[52px] text-[16px]">
                Confirm & Get Token →
              </button>
              <button onClick={() => setAnalyzed(false)} className="btn-ghost w-full text-[15px]">
                Change Symptoms
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
