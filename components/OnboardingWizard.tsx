import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import TextArea from './common/TextArea';
import Logo from './common/Logo';
import { saveUserProfile, User } from '../firebase';

interface OnboardingWizardProps {
  user: User;
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessSector: '',
    employeeCount: '1-5',
    monthlyRevenue: '',
    primaryGoal: '',
    description: '',
    taxStatus: 'Unregistered'
  });

  const sectors = [
    'Technology & Digital',
    'Retail & E-commerce',
    'Professional Services',
    'Construction & Trade',
    'Manufacturing',
    'Hospitality & Tourism',
    'Health & Wellness',
    'Other'
  ];

  const goals = [
    'Automate Invoicing',
    'Stay Compliant with SARS',
    'Scale Operations',
    'Professionalize Legal/Contracts',
    'Marketing Strategy'
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Persist onboarding data to Firestore
      await saveUserProfile(user.uid, {
        ...formData,
        fullName: user.displayName || 'Unnamed User',
        email: user.email || '',
        onboardingComplete: true
      });
      
      // Also keep in localStorage for immediate feedback if needed
      localStorage.setItem('smepal_business_profile', JSON.stringify(formData));
      
      onComplete();
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
      // Error boundary will catch the thrown error from handleFirestoreError
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-soft-reveal">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Business DNA</h2>
              <p className="text-sm font-medium text-slate-400">Tell us about your industry and scale.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Operating Sector</label>
                <div className="grid grid-cols-2 gap-3">
                  {sectors.map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, businessSector: s })}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${formData.businessSector === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Team Size</label>
                    <select 
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                        className="form-input"
                    >
                        <option>Solo Entrepreneur</option>
                        <option>1-5 Employees</option>
                        <option>6-20 Employees</option>
                        <option>21+ Employees</option>
                    </select>
                </div>
                <Input 
                    label="Estimated Turnover (Monthly)" 
                    id="rev" 
                    placeholder="R 50,000"
                    value={formData.monthlyRevenue}
                    onChange={(e) => setFormData({...formData, monthlyRevenue: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-soft-reveal">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Operational Goals</h2>
              <p className="text-sm font-medium text-slate-400">What is your primary focus for this quarter?</p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {goals.map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, primaryGoal: g })}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold border transition-all ${formData.primaryGoal === g ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-100'}`}
                  >
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.primaryGoal === g ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                        {formData.primaryGoal === g && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    {g}
                  </button>
                ))}
              </div>
              <TextArea 
                label="Brief Business Narrative" 
                id="desc" 
                placeholder="We provide boutique digital marketing for small law firms..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10 animate-soft-reveal">
            <div className="text-center space-y-4">
                <div className="h-20 w-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                    <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Telemetry Ready</h2>
              <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">Your enterprise workspace is ready for initialization. We've tailored the tools to your {formData.businessSector} needs.</p>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Summary Profile</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-white">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Sector</p>
                        <p className="text-xs font-bold text-slate-700">{formData.businessSector || 'Not set'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-white">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Scale</p>
                        <p className="text-xs font-bold text-slate-700">{formData.employeeCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-white col-span-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Focus</p>
                        <p className="text-xs font-bold text-slate-700">{formData.primaryGoal || 'General Operations'}</p>
                    </div>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>

      <div className="w-full max-w-xl space-y-10 relative z-10">
        <div className="flex flex-col items-center gap-6">
            <Logo />
            {/* Progress line */}
            <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-600 transition-all duration-700 ease-in-out" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
        </div>

        <Card className="!rounded-[3.5rem] !p-12 shadow-3xl border-0 bg-white min-h-[500px] flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center">
            {renderStep()}
          </div>

          <div className="flex items-center justify-between mt-12 pt-10 border-t border-slate-50">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                disabled={isLoading}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors px-4 py-2"
              >
                ← Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                disabled={step === 1 && !formData.businessSector}
                className="!px-10 !py-4 !rounded-2xl shadow-xl shadow-indigo-100 font-black uppercase tracking-widest text-xs"
              >
                Proceed to next stage
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                isLoading={isLoading}
                className="!px-12 !py-5 !rounded-2xl shadow-2xl shadow-indigo-200 font-black uppercase tracking-widest text-sm"
              >
                Initialize Workspace
              </Button>
            )}
          </div>
        </Card>

        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">
            Neural Infrastructure Deployment in Progress
        </p>
      </div>
    </div>
  );
};

export default OnboardingWizard;