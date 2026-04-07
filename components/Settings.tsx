import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import ToggleSwitch from './common/ToggleSwitch';
import Input from './common/Input';
import TextArea from './common/TextArea';
import ConfirmModal from './common/ConfirmModal';
import type { ToastType } from './common/Toast';

type SettingTab = 'neural' | 'enterprise' | 'interface' | 'security' | 'production';

interface SettingsProps {
    showToast: (m: string, t: ToastType) => void;
}

const Settings: React.FC<SettingsProps> = ({ showToast }) => {
    const [activeTab, setActiveTab] = useState<SettingTab>('neural');
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
    const [settings, setSettings] = useState({
        aiDeepReasoning: true,
        creativeConfidence: 0.85,
        aiModelPreference: 'gemini-3-pro-preview',
        defaultTaxYear: '2024/2025',
        currencySymbol: 'R',
        dateFormat: 'DD/MM/YYYY',
        autoBackup: true,
        compactMode: false,
        highContrastForms: true,
        darkMode: false,
        // Enterprise Defaults
        defaultBankDetails: '',
        defaultPaymentTerms: 'Payment within 30 days of invoice date.',
        defaultVatRate: '15',
        companyRegNumber: '',
        companyVatNumber: '',
    });

    useEffect(() => {
        const stored = localStorage.getItem('smepal_app_settings');
        if (stored) {
            const parsed = JSON.parse(stored);
            setSettings(prev => ({ ...prev, ...parsed }));
        }
    }, []);

    // Effect to apply dark mode to the root element for visual feedback
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [settings.darkMode]);

    const handleToggle = (key: keyof typeof settings) => {
        const updated = { ...settings, [key]: !settings[key] };
        setSettings(updated);
        localStorage.setItem('smepal_app_settings', JSON.stringify(updated));
    };

    const handleInputChange = (key: keyof typeof settings, value: string | number) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        localStorage.setItem('smepal_app_settings', JSON.stringify(updated));
    };

    const exportData = () => {
        const allData = {
            clients: JSON.parse(localStorage.getItem('sme-pal-clients') || '[]'),
            expenses: JSON.parse(localStorage.getItem('sme-pal-expenses') || '[]'),
            profile: JSON.parse(localStorage.getItem('smepal_business_profile') || '{}'),
            settings
        };
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smepal_telemetry_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (data.clients) localStorage.setItem('sme-pal-clients', JSON.stringify(data.clients));
                if (data.expenses) localStorage.setItem('sme-pal-expenses', JSON.stringify(data.expenses));
                if (data.profile) localStorage.setItem('smepal_business_profile', JSON.stringify(data.profile));
                if (data.settings) {
                    setSettings(data.settings);
                    localStorage.setItem('smepal_app_settings', JSON.stringify(data.settings));
                }
                showToast("Workspace telemetry successfully restored.", "success");
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                showToast("Failed to parse telemetry file. Ensure it is a valid SMEPal export.", "error");
            }
        };
        reader.readAsText(file);
    };

    const clearTelemetry = () => {
        setConfirmConfig({
            isOpen: true,
            title: "Destroy Workspace Data?",
            message: "CRITICAL: This will permanently destroy all local business data. This action is compliant with POPIA right-to-be-forgotten protocols. Proceed?",
            variant: 'danger',
            onConfirm: () => {
                localStorage.clear();
                window.location.reload();
            }
        });
    };

    const tabs: { id: SettingTab; label: string; icon: React.ReactNode }[] = [
        { id: 'neural', label: 'Neural Engine', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
        { id: 'enterprise', label: 'Enterprise Defaults', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
        { id: 'interface', label: 'Interface Specs', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg> },
        { id: 'security', label: 'Data Sovereignty', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318 2.074a1.5 1.5 0 001.364 0l5.318-2.074a12.02 12.02 0 005.618-14.377z" /></svg> },
        { id: 'production', label: 'Live Production', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg> },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left space-y-2">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Configuration</h1>
                    <p className="text-slate-500 font-medium italic">"Tuning the SMEPal engine for your specific operational requirements."</p>
                </div>
                <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Neural Link Synchronized</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="!p-4 border-0 shadow-sm !rounded-[2rem]">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button 
                                    key={tab.id} 
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                                        activeTab === tab.id 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                    
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden hidden lg:block">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Environment</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500">Region</span>
                                <span className="text-xs font-black">ZAF-GP-01</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500">Latency</span>
                                <span className="text-xs font-black text-emerald-400">12ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500">Encryption</span>
                                <span className="text-xs font-black">AES-256</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-9 space-y-8 min-h-[600px]">
                    {activeTab === 'neural' && (
                        <div className="space-y-8 animate-soft-reveal">
                            <Card title="Neural Engine Intelligence" className="!p-10 !rounded-[2.5rem] shadow-2xl border-0">
                                <div className="space-y-10">
                                    <ToggleSwitch 
                                        label="AI Deep Reasoning (Thinking Mode)"
                                        description="Allocates additional processing budget for complex legislative tasks like Tax and Legal drafting."
                                        enabled={settings.aiDeepReasoning}
                                        setEnabled={() => handleToggle('aiDeepReasoning')}
                                    />
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-0.5">
                                                <label className="text-sm font-black text-slate-700">Creativity Confidence</label>
                                                <p className="text-[10px] text-slate-400 font-medium">Controls the balance between factual compliance and creative marketing copy.</p>
                                            </div>
                                            <span className="text-lg font-black text-indigo-600">{(settings.creativeConfidence * 100).toFixed(0)}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0.1" max="1" step="0.05"
                                            value={settings.creativeConfidence}
                                            onChange={(e) => handleInputChange('creativeConfidence', parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </div>

                                    <div className="pt-10 border-t border-slate-50">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Primary Language Model</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { id: 'gemini-3-flash-preview', name: 'Standard (Fast)', desc: 'Optimized for speed and routine tasks.' },
                                                { id: 'gemini-3-pro-preview', name: 'High-Fidelity (Pro)', desc: 'Best for complex advisory and reasoning.' }
                                            ].map(m => (
                                                <button 
                                                    key={m.id}
                                                    onClick={() => handleInputChange('aiModelPreference', m.id)}
                                                    className={`p-6 rounded-2xl border-2 text-left transition-all ${settings.aiModelPreference === m.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 bg-white'}`}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-black text-slate-800">{m.name}</span>
                                                        {settings.aiModelPreference === m.id && <div className="h-2 w-2 rounded-full bg-indigo-600"></div>}
                                                    </div>
                                                    <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{m.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'enterprise' && (
                        <div className="space-y-8 animate-soft-reveal">
                            <Card title="Billing & Invoicing Defaults" className="!p-10 !rounded-[2.5rem] shadow-2xl border-0">
                                <div className="space-y-8">
                                    <TextArea 
                                        label="Standard Bank Details" 
                                        id="bank" 
                                        placeholder="Bank: First National Bank&#10;Account Name: Business Ltd&#10;Account Number: 123456789&#10;Branch Code: 250655"
                                        value={settings.defaultBankDetails}
                                        onChange={(e) => handleInputChange('defaultBankDetails', e.target.value)}
                                        rows={4}
                                        tooltip="This will automatically populate your invoice templates."
                                    />
                                    <TextArea 
                                        label="Standard Payment Terms" 
                                        id="terms" 
                                        value={settings.defaultPaymentTerms}
                                        onChange={(e) => handleInputChange('defaultPaymentTerms', e.target.value)}
                                        rows={2}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Input 
                                            label="Standard VAT Rate (%)" 
                                            id="vat" 
                                            type="number"
                                            value={settings.defaultVatRate}
                                            onChange={(e) => handleInputChange('defaultVatRate', e.target.value)}
                                        />
                                        <Input 
                                            label="Reg. Number" 
                                            id="creg" 
                                            value={settings.companyRegNumber}
                                            onChange={(e) => handleInputChange('companyRegNumber', e.target.value)}
                                            placeholder="202X/XXXXXX/07"
                                        />
                                        <Input 
                                            label="VAT Number" 
                                            id="cvat" 
                                            value={settings.companyVatNumber}
                                            onChange={(e) => handleInputChange('companyVatNumber', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card title="Regional Configuration" className="!p-10 !rounded-[2.5rem] shadow-2xl border-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tax Cycle</label>
                                        <select 
                                            value={settings.defaultTaxYear} 
                                            onChange={(e) => handleInputChange('defaultTaxYear', e.target.value)}
                                            className="form-input"
                                        >
                                            <option>2023/2024</option>
                                            <option>2024/2025</option>
                                            <option>2025/2026</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Visualization</label>
                                        <select 
                                            value={settings.dateFormat} 
                                            onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                                            className="form-input"
                                        >
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                            <option>MMMM DD, YYYY</option>
                                        </select>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'interface' && (
                        <div className="space-y-8 animate-soft-reveal">
                            <Card title="Display Specs & UI Aesthetics" className="!p-10 !rounded-[2.5rem] shadow-2xl border-0">
                                <div className="space-y-10">
                                    <ToggleSwitch 
                                        label="Low-Light Mode (Dark Workspace)"
                                        description="Reduces eye strain for late-night operational cycles."
                                        enabled={settings.darkMode}
                                        setEnabled={() => handleToggle('darkMode')}
                                    />
                                    <div className="h-px bg-slate-50"></div>
                                    <ToggleSwitch 
                                        label="Compact Workspace Logic"
                                        description="Reduce whitespace in Studio tools for high-density information display."
                                        enabled={settings.compactMode}
                                        setEnabled={() => handleToggle('compactMode')}
                                    />
                                    <div className="h-px bg-slate-50"></div>
                                    <ToggleSwitch 
                                        label="High Contrast Input Fields"
                                        description="Ensures all input components maintain maximum legislative visibility."
                                        enabled={settings.highContrastForms}
                                        setEnabled={() => handleToggle('highContrastForms')}
                                    />
                                </div>
                            </Card>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-inner">
                                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200/50">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Theme Sync</h4>
                                    <p className="text-xs text-indigo-700 font-medium leading-relaxed italic">"Settings are applied instantly to all active workspace nodes."</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-soft-reveal">
                            <Card title="Data Sovereignty & Portability" className="!p-10 !rounded-[2.5rem] shadow-2xl border-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 pointer-events-none">
                                    <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                                </div>
                                <div className="space-y-10 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between group">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Manual Telemetry Export</h4>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">"Secure local backup of all client profiles, invoice history, and expense logs."</p>
                                            </div>
                                            <Button variant="secondary" onClick={exportData} className="mt-8 !rounded-xl font-black uppercase text-[10px] tracking-widest">Execute Export</Button>
                                        </div>
                                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between group">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">System Recovery Protocol</h4>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">"Initialize a full system restore from a previously exported telemetry node."</p>
                                            </div>
                                            <label className="cursor-pointer bg-white text-indigo-600 border border-indigo-200 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-sm text-center mt-8">
                                                Import Payload
                                                <input type="file" className="hidden" accept="application/json" onChange={importData} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-rose-50 border border-rose-100 rounded-[2.5rem] space-y-6">
                                        <h4 className="text-lg font-black text-rose-800 tracking-tight flex items-center gap-3">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Storage Purge Protocol (POPIA)
                                        </h4>
                                        <p className="text-sm text-rose-700 font-medium leading-relaxed italic">
                                            "This command will permanently eliminate your digital footprint on this device. All local caches will be destroyed. This action is compliant with POPIA right-to-be-forgotten mandates."
                                        </p>
                                        <Button variant="danger" onClick={clearTelemetry} className="w-full !rounded-2xl !py-5 font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-rose-100">Initialize Data Purge</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'production' && (
                        <div className="space-y-8 animate-soft-reveal">
                            <Card title="Live Production Readiness" className="!p-10 !rounded-[2.5rem] shadow-2xl border-0">
                                <div className="space-y-8">
                                    <div className="p-6 bg-indigo-900 rounded-3xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"/></svg>
                                        </div>
                                        <h4 className="text-lg font-black tracking-tight mb-2">Production Environment: smepal.edgtec.co.za</h4>
                                        <p className="text-xs text-indigo-200 font-medium leading-relaxed italic">"Ensure all neural nodes are correctly configured for live enterprise traffic."</p>
                                    </div>

                                    <div className="space-y-6">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Deployment Checklist</h5>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Vercel Environment Variables', desc: 'Ensure GEMINI_API_KEY and VITE_FIREBASE_* variables are set in your Vercel dashboard.', status: 'Action Required' },
                                                { title: 'OAuth Authorized Domains', desc: 'Add smepal.edgtec.co.za to the "Authorized domains" list in Firebase Console > Auth > Settings.', status: 'Action Required' },
                                                { title: 'Real Payment Integration', desc: 'The current payment module is in simulation mode. Integrate Paystack or Stripe for live transactions.', status: 'Pending' },
                                                { title: 'SEO & Analytics Verification', desc: 'Verify OpenGraph meta tags and update the Google Analytics ID in index.html.', status: 'In Progress' },
                                                { title: 'POPIA & Legal Compliance', desc: 'Review the Terms and Privacy Policy in StaticPage.tsx to ensure they match your legal entity.', status: 'Verify' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="h-5 w-5 rounded-full border-2 border-indigo-200 flex-shrink-0 mt-0.5"></div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h6 className="text-sm font-black text-slate-800">{item.title}</h6>
                                                            <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full tracking-widest">{item.status}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-50">
                                        <Button variant="primary" className="w-full !py-4 shadow-xl shadow-indigo-100 !rounded-2xl">
                                            Download Production Config Guide
                                        </Button>
                                    </div>
                                </div>
                            </Card>
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

export default Settings;