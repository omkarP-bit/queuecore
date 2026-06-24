import { useState } from 'react';
import { ArrowRight, CheckCircle, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const symptoms = [
  { id: 'fever', label: 'Fever' },
  { id: 'cough', label: 'Cough' },
  { id: 'chest_pain', label: 'Chest pain' },
  { id: 'dizziness', label: 'Dizziness' },
  { id: 'fatigue', label: 'Fatigue' },
];

export default function SymptomTriage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinue = () => {
    navigate('/patient/confirm');
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[32px] border border-white/10 bg-surface/90 p-10 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-text-secondary mb-3">Symptom triage</p>
              <h1 className="text-4xl font-display font-bold text-white">How are you feeling today?</h1>
              <p className="mt-3 max-w-2xl text-text-secondary">Select your top symptoms so we can recommend the right specialist faster and reduce your wait time.</p>
            </div>
            <div className="rounded-[28px] bg-bg/80 border border-white/10 p-5 shadow-sm">
              <div className="text-sm text-text-secondary">Health tip</div>
              <div className="mt-3 text-lg font-semibold text-white">Stay calm and stay hydrated during your wait.</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm text-primary">
                <HeartPulse className="w-4 h-4" /> Recovery first
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {symptoms.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`rounded-[24px] border p-6 text-left transition-all ${selectedSymptoms[symptom.id] ? 'border-accent bg-accent/10 shadow-[0_20px_50px_-30px_rgba(66,224,196,0.75)]' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-white">{symptom.label}</div>
                    <div className="mt-2 text-sm text-text-secondary">A quick selection helps speed up your queue.</div>
                  </div>
                  {selectedSymptoms[symptom.id] && <CheckCircle className="w-6 h-6 text-accent" />}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="text-sm text-text-secondary">Choose all symptoms that apply before continuing.</div>
            <button
              onClick={handleContinue}
              className="btn-primary rounded-[24px] px-6 py-4 text-base font-semibold flex items-center gap-2 justify-center"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}