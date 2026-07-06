import { useState } from 'react';
import { ArrowRight, CheckCircle, HeartPulse, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { triageService, queueService } from '../services/api';

const symptoms = [
  { id: 'fever', label: 'Fever', description: 'High body temperature, chills' },
  { id: 'cough', label: 'Cough', description: 'Dry or productive cough' },
  { id: 'chest_pain', label: 'Chest pain', description: 'Discomfort or tightness in chest' },
  { id: 'headache', label: 'Headache', description: 'Persistent head pain or migraine' },
  { id: 'dizziness', label: 'Dizziness', description: 'Lightheaded, feeling faint' },
  { id: 'fatigue', label: 'Fatigue', description: 'Extreme tiredness, weakness' },
  { id: 'nausea', label: 'Nausea', description: 'Feeling sick, vomiting' },
  { id: 'body_ache', label: 'Body ache', description: 'Muscle or joint pain' },
];

export default function SymptomTriage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContinue = async () => {
    const selected = Object.entries(selectedSymptoms)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selected.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login', { replace: true });
      return;
    }

    const user = JSON.parse(userStr);
    if (!user?.id) {
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Call triage service
      let priority = 'routine';
      try {
        const triageResult = await triageService.getTriage(selected.join(', '));
        priority = triageResult?.priority || 'routine';
      } catch {
        // Triage may not be running; fall back to routine
      }

      // 2. Create token
      const token = await queueService.createToken({
        doctorId,
        priority,
        symptoms: selected,
        userId: user.id,
      });

      if (token?.id) {
        navigate(`/patient/token/${token.id}`, { state: { token } });
      } else {
        setError(token?.error || 'Failed to book token. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[32px] border border-white/10 bg-surface/90 p-10 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-text-secondary mb-3">Symptom triage</p>
              <h1 className="text-4xl font-display font-bold text-white">How are you feeling today?</h1>
              <p className="mt-3 max-w-2xl text-text-secondary">Select your symptoms so we can prioritize your visit and reduce wait time.</p>
            </div>
            <div className="rounded-[28px] bg-bg/80 border border-white/10 p-5 shadow-sm shrink-0">
              <div className="text-sm text-text-secondary">Health tip</div>
              <div className="mt-3 text-lg font-semibold text-white">Stay calm and stay hydrated during your wait.</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm text-primary">
                <HeartPulse className="w-4 h-4" /> Recovery first
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-3 rounded-[20px] border border-emergency/30 bg-emergency/10 text-emergency px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms[symptom.id];
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`rounded-[24px] border p-6 text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-[0_20px_50px_-30px_rgba(66,224,196,0.75)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">{symptom.label}</div>
                      <div className="mt-2 text-sm text-text-secondary">{symptom.description}</div>
                    </div>
                    {isSelected && <CheckCircle className="w-6 h-6 text-accent shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="text-sm text-text-secondary">
              {Object.values(selectedSymptoms).filter(Boolean).length} selected · Choose all that apply
            </div>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="btn-primary rounded-[24px] px-6 py-4 text-base font-semibold flex items-center gap-2 justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  Book token <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
