import React, { useState, useMemo, useEffect } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import TextArea from './common/TextArea';
import FileUpload from './common/FileUpload';
import Tooltip from './common/Tooltip';
import ConfirmModal from './common/ConfirmModal';
import type { ToastType } from './common/Toast';
import { suggestCompanyNames, getComplianceReadinessCheck } from '../services/geminiService';
import { CompanyRegistrationData, Director, CompanyType } from '../types';
import { validateIdNumber, validatePaymentDetails } from '../utils/validation';
import type { PaymentValidationErrors } from '../utils/validation';
import { auth, saveCompanyRegistration, getCompanyRegistration } from '../firebase';
import { CheckCircle2, AlertCircle, Info, Save, ArrowRight, ArrowLeft, ShieldCheck, FileText, UserCheck, CreditCard, Building2, Scale, RefreshCw } from 'lucide-react';


const DirectorForm: React.FC<{ director: Director; onUpdate: (director: Director) => void; onRemove: (id: string) => void; index: number }> = ({ director, onUpdate, onRemove, index }) => {
    
    const [idError, setIdError] = useState<string | null>(null);

    const handleIdBlur = () => {
        const error = validateIdNumber(director.identificationType, director.identificationNumber);
        setIdError(error);
    };

    const handleChange = (field: keyof Omit<Director, 'id'>, value: string | number) => {
        if (field === 'identificationNumber' || field === 'identificationType') {
            setIdError(null);
        }
        onUpdate({ ...director, [field]: value });
    };

    const copyPhysicalAddress = () => {
        onUpdate({ ...director, postalAddress: director.physicalAddress });
    };

    return (
        <div className="p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm space-y-5 relative animate-fade-in-up">
             <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                        {index + 1}
                    </div>
                    <h4 className="font-black text-slate-800 tracking-tight">Director Appointment</h4>
                </div>
                <Button variant="ghost" onClick={() => onRemove(director.id)} className="!py-1.5 !px-3 text-[10px] uppercase tracking-widest bg-rose-50 text-rose-600 hover:bg-rose-100">Remove</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Full Name" id={`fullName-${director.id}`} value={director.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
                 <div>
                    <Input 
                        label="Shareholding (%)" 
                        id={`shareholding-${director.id}`} 
                        type="number" 
                        min={0} 
                        max={100} 
                        value={director.shareholding} 
                        onChange={e => handleChange('shareholding', parseFloat(e.target.value) || 0)} 
                        tooltip="Percentage of the company this director will own. Total must be 100%."
                    />
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor={`idType-${director.id}`} className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">ID Type</label>
                    <select id={`idType-${director.id}`} value={director.identificationType} onChange={e => handleChange('identificationType', e.target.value as 'SA ID' | 'Passport')} onBlur={handleIdBlur} className="form-input">
                        <option>SA ID</option>
                        <option>Passport</option>
                    </select>
                </div>
                <div>
                    <Input label="ID / Passport Number" id={`idNumber-${director.id}`} value={director.identificationNumber} onChange={e => handleChange('identificationNumber', e.target.value)} onBlur={handleIdBlur} required className={idError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                    {idError && <p className="mt-1 text-xs text-red-600">{idError}</p>}
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email" id={`email-${director.id}`} type="email" value={director.email} onChange={e => handleChange('email', e.target.value)} required />
                <Input label="Phone Number" id={`phone-${director.id}`} value={director.phone} onChange={e => handleChange('phone', e.target.value)} required />
            </div>
            
            <TextArea label="Physical Address" id={`physicalAddress-${director.id}`} value={director.physicalAddress} onChange={e => handleChange('physicalAddress', e.target.value)} rows={2} required />
            
            <div className="relative">
                 <TextArea label="Postal Address" id={`postalAddress-${director.id}`} value={director.postalAddress} onChange={e => handleChange('postalAddress', e.target.value)} rows={2} required />
                 <div className="absolute top-0 right-0">
                    <button 
                        type="button"
                        onClick={copyPhysicalAddress}
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 cursor-pointer uppercase tracking-widest underline"
                    >
                        Copy Physical
                    </button>
                 </div>
            </div>
        </div>
    );
};

const ReviewSection: React.FC<{ title: string; data: { label: string; value?: string | number }[] }> = ({ title, data }) => (
    <div className="mt-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 mb-6">{title}</h3>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 bg-slate-50/50 p-6 rounded-3xl">
            {data.map(({ label, value }) => (
                value !== undefined && value !== '' ? (
                    <div key={label} className="sm:col-span-1">
                        <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</dt>
                        <dd className="text-sm font-bold text-slate-800 whitespace-pre-wrap">{value}</dd>
                    </div>
                ) : null
            ))}
        </dl>
    </div>
);

const CompanyTypeCard: React.FC<{ type: string; description: string; onSelect: () => void; icon: React.ReactElement }> = ({ type, description, onSelect, icon }) => (
    <div onClick={onSelect} className="group relative block cursor-pointer rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-lg hover:border-indigo-500 hover:shadow-2xl transition-all duration-500 ease-in-out text-left h-full">
        <div className="absolute right-8 top-8 rounded-full bg-indigo-50 p-2 opacity-0 transition-opacity group-hover:opacity-100 group-hover:scale-110 duration-300">
             <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        </div>
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">{icon}</div>
            <div>
                <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-4">{type}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
            </div>
        </div>
    </div>
);

const initialFormData: CompanyRegistrationData = {
    companyType: CompanyType.PRIVATE_COMPANY,
    names: { name1: '', name2: '', name3: '', name4: '' },
    businessPhysicalAddress: '',
    businessPostalAddress: '',
    yearEnd: 'February',
    directors: [],
    primaryContact: { name: '', email: '' },
    directorIdDocuments: {},
    businessAddressProof: null,
};

const STORAGE_KEY = 'sme-pal-company-reg-progress';

interface CompanyRegistrationProps {
    showToast: (m: string, t: ToastType) => void;
}

const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({ showToast }) => {
    const [step, setStep] = useState(0); 
    const [nameSuggestionDescription, setNameSuggestionDescription] = useState('An online store selling handmade leather goods in South Africa');
    const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState('');
    
    const [formData, setFormData] = useState<CompanyRegistrationData>(initialFormData);

    const [paymentDetails, setPaymentDetails] = useState({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
    const [paymentErrors, setPaymentErrors] = useState<PaymentValidationErrors>({});
    const [isPaying, setIsPaying] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [readinessCheck, setReadinessCheck] = useState<{ score: number; feedback: string } | null>(null);
    const [isCheckingReadiness, setIsCheckingReadiness] = useState(false);

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'primary' | 'danger';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });


    useEffect(() => {
        const loadProgress = async () => {
            const userId = auth.currentUser?.uid;
            
            // Try Firestore first
            if (userId) {
                try {
                    const firestoreData = await getCompanyRegistration(userId);
                    if (firestoreData) {
                        setFormData(prev => ({
                            ...prev,
                            ...firestoreData.formData,
                            directorIdDocuments: {},
                            businessAddressProof: null
                        }));
                        if (firestoreData.step < 8) {
                            setStep(firestoreData.step);
                        }
                        return; // Successfully loaded from Firestore
                    }
                } catch (e) {
                    console.error("Failed to load from Firestore", e);
                }
            }

            // Fallback to LocalStorage
            try {
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setFormData(prev => ({
                        ...prev,
                        ...parsed.formData,
                        directorIdDocuments: {},
                        businessAddressProof: null
                    }));
                    if (parsed.step < 8) {
                        setStep(parsed.step);
                    }
                }
            } catch (e) {
                console.error("Failed to load saved registration progress", e);
            }
        };

        loadProgress();
    }, []);

    const saveProgress = async (currentStep: number, currentData: CompanyRegistrationData) => {
        const userId = auth.currentUser?.uid;
        const dataToSave = {
            step: currentStep,
            formData: {
                ...currentData,
                directorIdDocuments: {},
                businessAddressProof: null
            }
        };

        // Always save to LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

        // Save to Firestore if logged in
        if (userId) {
            setIsSaving(true);
            try {
                await saveCompanyRegistration(userId, dataToSave);
            } catch (e) {
                console.error("Failed to save to Firestore", e);
            } finally {
                setIsSaving(false);
            }
        }
    };

    useEffect(() => {
        if (step > 0 && step < 8) {
            saveProgress(step, formData);
        }
    }, [step, formData]);


    const steps = useMemo(() => [
        { id: 1, name: 'Proposed Names' },
        { id: 2, name: 'Physical Presence' },
        { id: 3, name: 'Structure & Control' },
        { id: 4, name: 'Compliance Docs' },
        { id: 5, name: 'Primary Liaison' },
        { id: 6, name: 'Audit Review' },
        { id: 7, name: 'Final Payment' },
        { id: 8, name: 'Submission Successful' }
    ], []);
    const totalSteps = steps.length;

    const handleSelectCompanyType = (type: CompanyType) => {
        setFormData(prev => ({ ...prev, companyType: type }));
        setStep(1);
    };
    
    const resetWizard = () => {
        setConfirmConfig({
            isOpen: true,
            title: "Reset Registration?",
            message: "This will clear all registration progress. Are you sure?",
            variant: 'danger',
            onConfirm: () => {
                localStorage.removeItem(STORAGE_KEY);
                setFormData(initialFormData);
                setStep(0);
                setTransactionId('');
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                showToast("Registration progress cleared.", "info");
            }
        });
    }

    const handleNameSuggestion = async () => {
        setIsSuggesting(true);
        setSuggestionError('');
        setSuggestedNames([]);
        try {
            const names = await suggestCompanyNames(nameSuggestionDescription);
            setSuggestedNames(names);
        } catch (err: any) {
            setSuggestionError(err.message || 'Failed to suggest names.');
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleNestedFormChange = (section: 'names' | 'primaryContact', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: value
            }
        }));
    };
    
    const addDirector = () => {
        const newDirector: Director = {
            id: crypto.randomUUID(),
            fullName: '',
            identificationType: 'SA ID',
            identificationNumber: '',
            phone: '',
            email: '',
            physicalAddress: '',
            postalAddress: '',
            shareholding: 0,
        };
        setFormData(prev => ({ ...prev, directors: [...prev.directors, newDirector] }));
    };

    const updateDirector = (updatedDirector: Director) => {
        setFormData(prev => ({
            ...prev,
            directors: prev.directors.map(d => d.id === updatedDirector.id ? updatedDirector : d)
        }));
    };

    const removeDirector = (id: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Remove Director?",
            message: "Are you sure you want to remove this director from the application?",
            variant: 'danger',
            onConfirm: () => {
                setFormData(prev => {
                    const newDirectors = prev.directors.filter(d => d.id !== id);
                    const newDirectorIdDocuments = { ...prev.directorIdDocuments };
                    delete newDirectorIdDocuments[id];
                    return {
                        ...prev,
                        directors: newDirectors,
                        directorIdDocuments: newDirectorIdDocuments
                    };
                });
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                showToast("Director removed.", "info");
            }
        });
    };
    
    const handleUseSuggestedName = (name: string) => {
        const { names } = formData;
        const newNames = { ...names };
        if (!names.name1) newNames.name1 = name;
        else if (!names.name2) newNames.name2 = name;
        else if (!names.name3) newNames.name3 = name;
        else if (!names.name4) newNames.name4 = name;
        else newNames.name4 = name;
        setFormData(prev => ({ ...prev, names: newNames }));
        showToast(`"${name}" added to proposed names.`, "success");
    };

    const handleReadinessCheck = async () => {
        setIsCheckingReadiness(true);
        try {
            const result = await getComplianceReadinessCheck(formData);
            setReadinessCheck(result);
            showToast("Compliance audit complete.", "success");
        } catch (err: any) {
            showToast(err.message || "Failed to perform readiness check.", "error");
        } finally {
            setIsCheckingReadiness(false);
        }
    };

    const handleSaveAndExit = async () => {
        await saveProgress(step, formData);
        showToast("Progress saved securely. You can return anytime.", "success");
    };
    
    const copyBusinessAddress = () => {
        setFormData(prev => ({ ...prev, businessPostalAddress: prev.businessPhysicalAddress }));
    };

    const nextStep = () => {
        if (step === 1 && !formData.names.name1) {
            showToast('Please provide at least one proposed company name.', 'error');
            return;
        }
        if (step === 2 && (!formData.businessPhysicalAddress || !formData.businessPostalAddress)) {
            showToast('Please provide both physical and postal business addresses.', 'error');
            return;
        }
        if (step === 3) {
            if (formData.directors.length === 0) {
                showToast('You must add at least one director.', 'error');
                return;
            }
            if (formData.companyType === CompanyType.NON_PROFIT_COMPANY && formData.directors.length < 3) {
                showToast('A Non-Profit Company (NPC) must have at least 3 directors by law.', 'error');
                return;
            }
            if (formData.companyType === CompanyType.PRIVATE_COMPANY) {
                const totalShareholding = formData.directors.reduce((sum, d) => sum + d.shareholding, 0);
                if (Math.abs(totalShareholding - 100) > 0.1) {
                    setConfirmConfig({
                        isOpen: true,
                        title: "Verify Shareholding?",
                        message: `Total shareholding is ${totalShareholding}%. It should ideally be 100%. Do you want to verify this later?`,
                        onConfirm: () => {
                            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                            setStep(prev => Math.min(prev + 1, totalSteps));
                        }
                    });
                    return;
                }
            }
        }
        if (step === 4) {
            const allDocsUploaded = formData.directors.every(dir => !!formData.directorIdDocuments[dir.id]);
            if (!allDocsUploaded || !formData.businessAddressProof) {
                showToast('Please upload all required documents.', 'error');
                return;
            }
        }
        if (step === 5) {
            if (!formData.primaryContact.name || !formData.primaryContact.email) {
                showToast('Please provide the primary contact details.', 'error');
                return;
            }
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const isStepValid = (currentStep: number) => {
        switch (currentStep) {
            case 1: return formData.names.name1.trim().length > 0;
            case 2: return formData.businessPhysicalAddress.trim().length > 0 && formData.businessPostalAddress.trim().length > 0;
            case 3: return formData.directors.length > 0 && formData.directors.every(d => d.fullName && d.identificationNumber && d.email);
            case 4: return !!formData.businessAddressProof && formData.directors.every(d => !!formData.directorIdDocuments[d.id]);
            case 5: return formData.primaryContact.name.trim().length > 0 && formData.primaryContact.email.trim().length > 0;
            case 6: return true;
            case 7: return paymentDetails.cardholderName && paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvc;
            default: return true;
        }
    };
    
    const submitRegistrationData = () => {
        for (const director of formData.directors) {
            const error = validateIdNumber(director.identificationType, director.identificationNumber);
            if (error) {
                showToast(`Error for Director ${director.fullName || ' '}: ${error}`, 'error');
                setStep(3);
                return;
            }
        }
        console.log('Company Registration Data Submitted.');
    };
    
    const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let formattedValue = value;
        if (id === 'cardNumber') {
            formattedValue = value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
        }
        if (id === 'expiryDate') {
            formattedValue = value.replace(/[^\d]/g, '');
            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
            }
        }
        if (id === 'cvc') {
            formattedValue = value.replace(/[^\d]/g, '').slice(0, 4);
        }
        setPaymentDetails(prev => ({ ...prev, [id]: formattedValue }));
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentErrors({});
        const errors = validatePaymentDetails(paymentDetails);
        if (Object.keys(errors).length > 0) {
            setPaymentErrors(errors);
            return;
        }
        setIsPaying(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        submitRegistrationData();
        localStorage.removeItem(STORAGE_KEY);
        setTransactionId(`TXN-${crypto.randomUUID().split('-')[0].toUpperCase()}`);
        setIsPaying(false);
        setStep(8);
    };


    if (step === 0) {
        return (
            <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left animate-fade-in">
                <div className="text-center space-y-6 pt-12">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                        Official Service Portal
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        Launch Your <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">Vision</span> Properly.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed italic">
                        "SMEPal handles your CIPC registration from start to finish. Precision, compliance, and speed."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <CompanyTypeCard
                        type={CompanyType.PRIVATE_COMPANY}
                        description="Most common for-profit structure. Owned by shareholders, managed by directors. Ideal for startups and small businesses looking to grow."
                        onSelect={() => handleSelectCompanyType(CompanyType.PRIVATE_COMPANY)}
                        icon={<div className="bg-indigo-600 text-white p-5 rounded-[1.5rem] shadow-xl shadow-indigo-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>}
                    />
                    <CompanyTypeCard
                        type={CompanyType.NON_PROFIT_COMPANY}
                        description="Formed for public benefit. No shareholders; assets must be used for social objectives. Requires minimum 3 directors and a formal MOI."
                        onSelect={() => handleSelectCompanyType(CompanyType.NON_PROFIT_COMPANY)}
                        icon={<div className="bg-emerald-600 text-white p-5 rounded-[1.5rem] shadow-xl shadow-emerald-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg></div>}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <Card title="Legal Compliance Architecture" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        Certified ID/Passport
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">IDs must be certified by a Commissioner of Oaths within 3 months. NPCs require 3 distinct IDs.</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">Anti-Fraud Verification</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        Physical Address
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">A physical address in SA where legal process can be served. FICA requires a utility bill.</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">FICA Compliance</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        MOI (Constitution)
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">The rules of governance. We use the official CIPC standard template for maximum safety.</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">Companies Act (2008)</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                        Registration Fee
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">Full handling of CIPC disbursements and name reservation for R499 once-off.</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">Comprehensive Service</p>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-indigo-700 text-white rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="text-left space-y-4 relative z-10">
                                <h3 className="text-3xl font-black tracking-tight leading-none">Registration Timeline.</h3>
                                <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-sm">Most registrations are completed within 3 to 5 business days, depending on system load.</p>
                            </div>
                            <div className="flex gap-8 relative z-10">
                                <div className="text-center">
                                    <div className="text-3xl font-black">D1</div>
                                    <div className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Submit</div>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-black">D3</div>
                                    <div className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Process</div>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-emerald-400">D5</div>
                                    <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Certify</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <Card title="Operational Roadmap" className="!rounded-[3rem] shadow-xl border-0 !p-10">
                            <ul className="space-y-10 text-left">
                                <li className="flex gap-6 group">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">1</div>
                                    <div>
                                        <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight">Income Tax Reg</h5>
                                        <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">SARS automatically registers your new entity for income tax upon CIPC approval.</p>
                                    </div>
                                </li>
                                <li className="flex gap-6 group">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">2</div>
                                    <div>
                                        <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight">Business Banking</h5>
                                        <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">Use your Cor14.3 certificate to open a formal account at any major South African bank.</p>
                                    </div>
                                </li>
                                <li className="flex gap-6 group">
                                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">3</div>
                                    <div>
                                        <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight">B-BBEE Affidavit</h5>
                                        <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">New SMEs qualify for a Level 1 B-BBEE affidavit as an EME automatically.</p>
                                    </div>
                                </li>
                            </ul>
                        </Card>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10 text-left shadow-inner">
                             <h4 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-4">Director Eligibility Notice</h4>
                             <p className="text-xs text-indigo-700 leading-relaxed font-medium">Directors must be at least 18 years old, not currently declared insolvent, and not prohibited from holding office by a court order.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 pb-24 animate-fade-in">
            {/* Left Sidebar - Progress & Help */}
            <div className="lg:col-span-3 space-y-8">
                <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-8 shadow-xl sticky top-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-900 tracking-tight">Registration</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wizard v2.0</p>
                        </div>
                    </div>

                    <nav aria-label="Progress" className="space-y-4">
                        {steps.map((s, index) => (
                            <div key={s.name} className="flex items-center gap-4 group">
                                <div className="relative flex flex-col items-center">
                                    {step > s.id ? (
                                        <div className="h-6 w-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                    ) : step === s.id ? (
                                        <div className="h-6 w-6 rounded-lg border-2 border-indigo-600 bg-white flex items-center justify-center ring-4 ring-indigo-50">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                        </div>
                                    ) : (
                                        <div className="h-6 w-6 rounded-lg border-2 border-slate-100 bg-slate-50/50 flex items-center justify-center">
                                            <span className="text-[8px] font-black text-slate-300">{s.id}</span>
                                        </div>
                                    )}
                                    {index < steps.length - 1 && (
                                        <div className={`w-0.5 h-6 my-1 ${step > s.id ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                                    )}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step === s.id ? 'text-indigo-600' : step > s.id ? 'text-slate-600' : 'text-slate-300'}`}>
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
                        <Button 
                            variant="ghost" 
                            onClick={handleSaveAndExit} 
                            isLoading={isSaving}
                            className="w-full !justify-start gap-3 text-slate-500 hover:text-indigo-600 !px-4"
                        >
                            <Save className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Save & Exit</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={resetWizard} 
                            className="w-full !justify-start gap-3 text-slate-400 hover:text-rose-600 !px-4"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Reset Wizard</span>
                        </Button>
                    </div>
                </div>

                {/* Contextual Help */}
                <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hidden lg:block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="h-8 w-8 bg-white/10 rounded-xl flex items-center justify-center">
                            <Info className="h-4 w-4 text-indigo-300" />
                        </div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-indigo-200">Pro Tip</h4>
                        <p className="text-xs text-indigo-100/80 leading-relaxed font-medium italic">
                            {step === 1 && "CIPC name reservations can take 2-3 business days. Choose unique names to avoid rejection."}
                            {step === 2 && "Your registered office is where official legal documents will be served. It must be a physical street address."}
                            {step === 3 && "Private companies (Pty Ltd) need at least 1 director. NPCs need at least 3. Ensure ID numbers are accurate."}
                            {step === 4 && "Certified documents must not be older than 3 months. Use a clear scan to avoid processing delays."}
                            {step >= 5 && "The primary liaison will receive all CIPC correspondence. Use an email address you check frequently."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-10">
                <div className="text-left space-y-2">
                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {steps.find(s => s.id === step)?.name || 'Registration Wizard'}
                     </h1>
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Entity Type: <span className="text-indigo-600">{formData.companyType}</span>
                     </p>
                </div>
                
                <div className="space-y-10">
                {step === 1 && (
                    <div className="space-y-10">
                        <Card title="Proposed Company Names" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                             <p className="text-sm font-medium text-slate-500 mb-8 text-left italic">"Provide up to 4 names in order of preference for the CIPC reservation queue."</p>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <Input label="Primary Name" id="name1" value={formData.names.name1} onChange={e => handleNestedFormChange('names', 'name1', e.target.value)} required />
                                <Input label="Alternative 1" id="name2" value={formData.names.name2} onChange={e => handleNestedFormChange('names', 'name2', e.target.value)} />
                                <Input label="Alternative 2" id="name3" value={formData.names.name3} onChange={e => handleNestedFormChange('names', 'name3', e.target.value)} />
                                <Input label="Alternative 3" id="name4" value={formData.names.name4} onChange={e => handleNestedFormChange('names', 'name4', e.target.value)} />
                             </div>
                        </Card>

                        <div className="bg-indigo-700 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                <div className="flex-1 text-left space-y-4">
                                    <h3 className="text-3xl font-black tracking-tight leading-none">Need Inspiration?</h3>
                                    <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-sm">Describe your mission and let the SMEPal Engine suggest unique, available options.</p>
                                    <div className="flex flex-col gap-4 mt-6">
                                        <textarea 
                                            value={nameSuggestionDescription} 
                                            onChange={e => setNameSuggestionDescription(e.target.value)} 
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-medium placeholder:text-indigo-300 focus:bg-white/20 focus:outline-none transition-all"
                                            rows={2}
                                        />
                                        <Button type="button" onClick={handleNameSuggestion} isLoading={isSuggesting} className="!bg-white !text-indigo-700 hover:!bg-indigo-50 !py-4 shadow-xl">Inject Creative DNA</Button>
                                    </div>
                                    {suggestionError && <p className="text-rose-300 text-xs font-bold">{suggestionError}</p>}
                                </div>
                                <div className="w-full md:w-64 flex flex-col gap-3">
                                    {suggestedNames.length > 0 ? (
                                        <div className="space-y-2 animate-fade-in">
                                            {suggestedNames.map(name => (
                                                <button 
                                                    key={name} 
                                                    type="button" 
                                                    onClick={() => handleUseSuggestedName(name)} 
                                                    className="w-full bg-white/5 hover:bg-white/20 border border-white/10 p-3 rounded-xl text-xs font-black uppercase tracking-widest text-left transition-all"
                                                >
                                                    + {name}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-48 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                                            Output Terminal
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                     <Card title="Physical Presence" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                        <div className="space-y-10">
                            <fieldset className="space-y-6 text-left">
                                <legend className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-3 w-full mb-4">Official Registered Address</legend>
                                <TextArea label="Full Physical Address" id="businessPhysicalAddress" value={formData.businessPhysicalAddress} onChange={e => setFormData(p => ({...p, businessPhysicalAddress: e.target.value}))} required />
                                <div className="relative">
                                    <TextArea label="Postal / Service Address" id="businessPostalAddress" value={formData.businessPostalAddress} onChange={e => setFormData(p => ({...p, businessPostalAddress: e.target.value}))} required />
                                    <div className="absolute top-0 right-0">
                                        <button 
                                            type="button"
                                            onClick={copyBusinessAddress}
                                            className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 cursor-pointer uppercase tracking-widest underline"
                                        >
                                            Same as Physical
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="space-y-6 text-left border-t border-slate-50 pt-8">
                                <legend className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pb-3 w-full mb-4">Financial Configuration</legend>
                                <div className="max-w-md">
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="yearEnd" className="block text-xs font-black text-slate-500 uppercase tracking-wider">Financial Year End</label>
                                        <Tooltip content="The month your financial year ends. Standard for SA is February.">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-slate-300 hover:text-indigo-500 transition-colors cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </Tooltip>
                                    </div>
                                    <select id="yearEnd" value={formData.yearEnd} onChange={e => setFormData(p => ({...p, yearEnd: e.target.value}))} className="form-input">
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (<option key={month} value={month}>{month}</option>))}
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </Card>
                )}

                {step === 3 && (
                     <Card title="Structure & Control" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                        <div className="text-left space-y-8">
                            {formData.companyType === CompanyType.NON_PROFIT_COMPANY ? (
                                <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 mb-10 shadow-sm">
                                    <p className="text-xs text-indigo-900 font-black uppercase tracking-widest mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        NPC Regulatory Protocol
                                    </p>
                                    <p className="text-sm text-indigo-700 font-medium leading-relaxed italic">"A Non-Profit Company (NPC) must maintain a minimum of <span className="font-black underline text-indigo-900">3 directors</span> at all times to satisfy the requirements of the Companies Act."</p>
                                </div>
                            ) : (
                                <p className="text-sm font-medium text-slate-500 mb-8 italic">"Appoint your board of directors and allocate equity distribution."</p>
                            )}

                            <div className="space-y-8">
                                {formData.directors.map((director, index) => (<DirectorForm key={director.id} director={director} onUpdate={updateDirector} onRemove={removeDirector} index={index}/>))}
                                
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                    <div className="flex items-center gap-10">
                                        {formData.companyType === CompanyType.PRIVATE_COMPANY && (
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Equity Allocation</p>
                                                <span className={`text-3xl font-black ${Math.abs(formData.directors.reduce((s,d) => s + d.shareholding, 0) - 100) < 0.1 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                    {formData.directors.reduce((s,d) => s + d.shareholding, 0).toFixed(0)}%
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Board Count</p>
                                            <span className="text-3xl font-black text-slate-900">{formData.directors.length} <span className="text-xs text-slate-300 font-bold uppercase">Appointed</span></span>
                                        </div>
                                    </div>
                                    <Button type="button" variant="primary" onClick={addDirector} className="shadow-lg shadow-indigo-100 !py-4 px-8">+ Add Director</Button>
                                </div>
                                
                                {formData.directors.length === 0 && <p className="text-sm text-center font-black text-rose-500 uppercase tracking-widest animate-pulse">Required: At least one director entry</p>}
                            </div>
                        </div>
                    </Card>
                )}

                {step === 4 && (
                    <Card title="Compliance Repository" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                         <div className="bg-amber-50 border border-amber-100 p-8 mb-10 rounded-[2rem] text-left shadow-sm">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 bg-amber-200 h-10 w-10 rounded-xl flex items-center justify-center text-amber-700">
                                    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1-1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em] mb-2">Legislative Protocol</p>
                                    <p className="text-sm text-amber-700 font-medium leading-relaxed italic">
                                        "Documents must be <span className="font-black underline uppercase">Certified</span> within 3 months to confirm biometric integrity. FICA mandates local address verification."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10 text-left">
                            <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-inner relative group">
                                <div className="absolute top-6 right-8 text-[10px] font-black text-indigo-400 uppercase tracking-widest">FICA Requirement</div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Registered Office Verification</h3>
                                <p className="text-xs text-slate-400 font-medium mb-6">Upload a utility bill or lease agreement for the physical business location.</p>
                                <FileUpload
                                    label="Digital Proof (PDF/JPG)"
                                    id="business-address-proof"
                                    currentFile={formData.businessAddressProof}
                                    onFileSelect={(file) => setFormData(p => ({ ...p, businessAddressProof: file }))}
                                    onFileRemove={() => setFormData(p => ({ ...p, businessAddressProof: null }))}
                                />
                            </div>

                            {formData.directors.map((director) => (
                                <div key={director.id} className="pt-10 border-t border-slate-50">
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2 uppercase tracking-widest text-xs">Director Credentials: <span className="text-indigo-600 font-black">{director.fullName || `D${formData.directors.indexOf(director) + 1}`}</span></h3>
                                    <p className="text-xs text-slate-400 font-medium mb-6">Ensure the certification stamp is clear, dated, and signed by a commissioner of oaths.</p>
                                     <FileUpload
                                        label="Certified ID Scan"
                                        id={`director-doc-${director.id}`}
                                        currentFile={formData.directorIdDocuments[director.id] || null}
                                        onFileSelect={(file) => setFormData(prev => ({ ...prev, directorIdDocuments: { ...prev.directorIdDocuments, [director.id]: file } }))}
                                        onFileRemove={() => setFormData(prev => ({ ...prev, directorIdDocuments: { ...prev.directorIdDocuments, [director.id]: null } }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
                
                {step === 5 && (
                     <Card title="Primary Liaison" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                        <p className="text-sm font-medium text-slate-500 mb-10 text-left italic">"Select the designated authority for CIPC status updates and certificate dispatch."</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Liaison Name" id="primaryContactName" value={formData.primaryContact.name} onChange={e => handleNestedFormChange('primaryContact', 'name', e.target.value)} required />
                            <Input label="Secure Dispatch Email" id="primaryContactEmail" type="email" value={formData.primaryContact.email} onChange={e => handleNestedFormChange('primaryContact', 'email', e.target.value)} required />
                        </div>
                    </Card>
                )}

                {step === 6 && (
                    <Card title="Audit Review" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                        <div className="text-left space-y-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1 space-y-4">
                                    <div className="bg-emerald-50 p-6 rounded-[1.5rem] border border-emerald-100 flex items-center gap-4 mb-4">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Engine Scan: System Data Consistent</p>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Our AI engine has performed a preliminary scan of your application. For a deeper compliance audit, use the Neural Readiness Check.
                                    </p>
                                </div>
                                <div className="w-full md:w-72">
                                    <Button 
                                        onClick={handleReadinessCheck} 
                                        isLoading={isCheckingReadiness}
                                        variant="secondary"
                                        className="w-full !py-6 !rounded-2xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                    >
                                        <ShieldCheck className="h-5 w-5 mr-2" />
                                        Neural Readiness Check
                                    </Button>
                                </div>
                            </div>

                            {readinessCheck && (
                                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white animate-fade-in-up relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8">
                                        <div className="h-20 w-20 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative">
                                            <span className="text-2xl font-black">{readinessCheck.score}</span>
                                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow" style={{ clipPath: `inset(0 ${100 - readinessCheck.score}% 0 0)` }}></div>
                                        </div>
                                    </div>
                                    <div className="relative z-10 max-w-xl">
                                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Compliance Audit Result</h4>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <div className="text-indigo-100/90 font-medium leading-relaxed whitespace-pre-wrap">
                                                {readinessCheck.feedback}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                <ReviewSection title="Identity Profiles" data={[
                                    { label: 'Selected Structure', value: formData.companyType },
                                    { label: 'Primary Entity Name', value: formData.names.name1 }, 
                                    { label: 'Backup Identification', value: formData.names.name2 || 'None' }
                                ]} />
                                <ReviewSection title="Physical Location" data={[
                                    { label: 'Business Hub', value: formData.businessPhysicalAddress }, 
                                    { label: 'Fiscal Close', value: formData.yearEnd }
                                ]} />
                            </div>
                            {formData.directors.map((dir, i) => (
                                <ReviewSection key={dir.id} title={`Board Director ${i+1}`} data={[
                                    { label: 'Identified As', value: dir.fullName }, 
                                    { label: 'Control Stake', value: formData.companyType === CompanyType.PRIVATE_COMPANY ? `${dir.shareholding}%` : 'Strategic NPC Director' },
                                    { label: 'Credentials', value: `${dir.identificationType}: ${dir.identificationNumber}` }, 
                                    { label: 'Contact', value: `${dir.email} / ${dir.phone}` }
                                ]} />
                            ))}
                             <ReviewSection title="Compliance Payload" data={[
                                { label: 'Address Documentation', value: formData.businessAddressProof?.name || 'Missing' },
                                ...formData.directors.map(d => ({
                                    label: `ID: ${d.fullName}`,
                                    value: formData.directorIdDocuments[d.id]?.name || 'Missing'
                                }))
                            ]} />
                             <div className="mt-12 bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-200/20 rounded-full -mr-10 -mt-10"></div>
                                <p className="text-xs text-indigo-800 font-bold leading-relaxed relative z-10 italic">
                                    "By initiating the transmission, you confirm that all telemetry provided is accurate. Falsification of documents is a criminal offense under the Companies Act."
                                </p>
                             </div>
                         </div>
                    </Card>
                )}

                {step === 7 && (
                    <Card title="Final Transmission" className="!rounded-[3rem] !p-10 shadow-2xl border-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Service Disbursement</h3>
                                <div className="space-y-4 text-sm font-medium text-slate-500">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                        <span className="uppercase tracking-widest text-[10px] font-black">Official Filing Fee</span>
                                        <span className="font-black text-slate-800">R 499.00</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                        <span className="uppercase tracking-widest text-[10px] font-black">Electronic Dispatch</span>
                                        <span className="font-bold text-emerald-600">INCLUDED</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-6">
                                        <span className="uppercase tracking-[0.3em] text-[12px] font-black text-indigo-600">Total Commitment</span>
                                        <span className="text-4xl font-black text-slate-900 tracking-tighter">R 499.00</span>
                                    </div>
                                </div>
                                <div className="mt-10 p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl relative overflow-hidden shadow-indigo-100">
                                    <div className="absolute top-0 right-0 h-16 w-16 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Encrypted Tunnel</p>
                                    <p className="text-xs font-medium leading-relaxed opacity-80 italic">Your session is secured by industry-standard TLS encryption. Transaction processing is handled by our PCI-compliant gateway.</p>
                                </div>
                            </div>
                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                 <div>
                                    <Input label="Full Name on Asset" id="cardholderName" value={paymentDetails.cardholderName} onChange={handlePaymentInputChange} required disabled={isPaying} className={paymentErrors.cardholderName ? 'border-red-500' : ''}/>
                                    {paymentErrors.cardholderName && <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest">{paymentErrors.cardholderName}</p>}
                                </div>
                                <div>
                                    <Input label="Secure Card Number" id="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentInputChange} placeholder="0000 0000 0000 0000" required disabled={isPaying} className={paymentErrors.cardNumber ? 'border-red-500' : ''}/>
                                     {paymentErrors.cardNumber && <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest">{paymentErrors.cardNumber}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                     <div>
                                        <Input label="Asset Expiry" id="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentInputChange} placeholder="MM/YY" required disabled={isPaying} className={paymentErrors.expiryDate ? 'border-red-500' : ''}/>
                                        {paymentErrors.expiryDate && <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest">{paymentErrors.expiryDate}</p>}
                                    </div>
                                     <div>
                                        <Input label="Secure Code (CVC)" id="cvc" value={paymentDetails.cvc} onChange={handlePaymentInputChange} placeholder="123" required disabled={isPaying} className={paymentErrors.cvc ? 'border-red-500' : ''}/>
                                        {paymentErrors.cvc && <p className="mt-1 text-[10px] font-black text-rose-500 uppercase tracking-widest">{paymentErrors.cvc}</p>}
                                    </div>
                                </div>
                                <Button type="submit" isLoading={isPaying} className="w-full !py-5 shadow-2xl shadow-indigo-100 !rounded-2xl text-base font-black uppercase tracking-widest">
                                    {isPaying ? 'TRANSMITTING DATA...' : 'AUTHORIZE REGISTRATION'}
                                </Button>
                            </form>
                        </div>
                    </Card>
                )}

                {step === 8 && (
                    <Card className="!rounded-[3.5rem] shadow-3xl border-0">
                        <div className="text-center py-20">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600 shadow-lg animate-bounce">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <h3 className="mt-10 text-4xl font-black text-slate-900 tracking-tighter leading-none">Payload Successfully Dispatched.</h3>
                            <div className="mt-6 max-w-xl mx-auto space-y-6">
                                <p className="text-lg text-slate-500 font-medium italic leading-relaxed px-10">
                                    "Your application for <span className="font-black text-slate-800">{formData.names.name1}</span> is now queued in the CIPC central mainframe."
                                </p>
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl inline-block shadow-sm">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 text-center">Reference Identity</p>
                                    <p className="text-xl font-black text-indigo-900 font-mono tracking-tight">{transactionId}</p>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                                    A confirmation dispatch has been sent to your liaison email. Manual audit usually takes 3-5 business days.
                                </p>
                            </div>
                            <div className="mt-12 flex justify-center gap-4">
                                <Button onClick={() => { setFormData(initialFormData); setStep(0); setTransactionId(''); }} className="!rounded-2xl !py-4 px-10">New Registration</Button>
                                <Button variant="secondary" className="!rounded-2xl !py-4 px-10 bg-slate-50 hover:bg-slate-100 border-0 text-slate-600 font-black uppercase tracking-widest text-[10px]">Back to Control Panel</Button>
                            </div>
                        </div>
                    </Card>
                )}
                
                {step < 8 && (
                    <div className="flex justify-between items-center pt-10 border-t border-slate-100">
                        <div className="flex gap-4">
                            {step > 1 && (
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={prevStep} 
                                    disabled={isPaying} 
                                    className="!px-8 !py-4 text-slate-400 hover:text-indigo-600"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            )}
                            {step === 1 && (
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setStep(0)} 
                                    className="!px-8 !py-4 text-slate-400 hover:text-indigo-600"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Change Type
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {isSaving && (
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">
                                    Syncing...
                                </span>
                            )}
                            {step < 6 && (
                                <Button 
                                    type="button" 
                                    onClick={nextStep} 
                                    className="shadow-xl shadow-indigo-100 !rounded-xl px-12 !py-4"
                                >
                                    Continue Journey
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                            {step === 6 && (
                                <Button 
                                    type="button" 
                                    onClick={nextStep} 
                                    className="shadow-2xl shadow-indigo-200 !rounded-xl px-12 !py-4 !bg-indigo-600"
                                >
                                    Confirm & Proceed to Payment
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                variant={confirmConfig.variant}
                onConfirm={confirmConfig.onConfirm}
                onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default CompanyRegistration;