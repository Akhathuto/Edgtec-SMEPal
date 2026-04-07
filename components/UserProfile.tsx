import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import ToggleSwitch from './common/ToggleSwitch';
import ConfirmModal from './common/ConfirmModal';
import type { ToastType } from './common/Toast';

interface UserProfileProps {
    showToast: (m: string, t: ToastType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ showToast }) => {
    const [user, setUser] = useState({
        name: 'Jane Naledi D.',
        email: 'jane.doe@edgtec.co.za',
        role: 'Administrator',
        company: 'EDGTEC (Pty) Ltd',
        regNumber: '2025/534716/07',
        vatNumber: '4010293847',
        phone: '+27 71 184 6709',
        avatar: 'https://picsum.photos/200',
    });

    const [notifications, setNotifications] = useState({
        weeklySummary: true,
        productUpdates: true,
        securityAlerts: true,
    });

    const [isSaving, setIsSaving] = useState(false);
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

    const handleUserChange = (field: keyof typeof user, value: string) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleUserChange('avatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API sync
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        showToast('Profile telemetry synchronized successfully.', 'success');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Account Settings</h1>
                    <p className="text-slate-500 font-medium italic">"Manage your personal identity and business credentials."</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Session sync</p>
                        <p className="text-sm font-bold text-slate-700">Today, 09:42 SAST</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Identity Overview */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="!p-0 !rounded-[2.5rem] shadow-2xl border-0 overflow-hidden relative group">
                        <div className="h-32 bg-indigo-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                            </div>
                        </div>
                        <div className="px-8 pb-10">
                            <div className="relative -mt-16 mb-6 inline-block group/avatar">
                                <img 
                                    src={user.avatar} 
                                    alt="User Profile" 
                                    className="h-32 w-32 rounded-[2.5rem] border-8 border-white object-cover shadow-xl group-hover/avatar:brightness-90 transition-all" 
                                />
                                <label 
                                    htmlFor="avatar-upload" 
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/20 rounded-[2.5rem]"
                                >
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarUpload} accept="image/*" />
                                </label>
                                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-white"></div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h3>
                                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{user.role}</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{user.company}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Session Statistics" className="!p-8 bg-white border-0 shadow-sm relative overflow-hidden">
                        <div className="space-y-6">
                            {[
                                { label: 'Invoices Generated', value: '42', icon: '📄' },
                                { label: 'Active Clients', value: '18', icon: '👥' },
                                { label: 'Expenses Scanned', value: '156', icon: '🧾' },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{stat.icon}</span>
                                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-800">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Detailed Settings */}
                <div className="lg:col-span-8 space-y-8">
                    {/* General Settings */}
                    <Card className="!p-10 !rounded-[2.5rem] shadow-2xl border-0 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-1 bg-indigo-600 w-1/3"></div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Entity Credentials</h3>
                        <form onSubmit={handleSaveChanges} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input 
                                    label="Full Legal Name" 
                                    id="name" 
                                    value={user.name} 
                                    onChange={e => handleUserChange('name', e.target.value)} 
                                />
                                <Input 
                                    label="Official Email" 
                                    id="email" 
                                    type="email" 
                                    value={user.email} 
                                    onChange={e => handleUserChange('email', e.target.value)} 
                                />
                            </div>

                            <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input 
                                    label="Business Identity (Pty Ltd)" 
                                    id="company" 
                                    value={user.company} 
                                    onChange={e => handleUserChange('company', e.target.value)} 
                                    tooltip="Your official trading name registered with CIPC."
                                />
                                <Input 
                                    label="Registration Number" 
                                    id="regNumber" 
                                    value={user.regNumber} 
                                    onChange={e => handleUserChange('regNumber', e.target.value)} 
                                    placeholder="202X/XXXXXX/07"
                                />
                                <Input 
                                    label="VAT Number (Optional)" 
                                    id="vatNumber" 
                                    value={user.vatNumber} 
                                    onChange={e => handleUserChange('vatNumber', e.target.value)} 
                                />
                                <Input 
                                    label="Contact Line" 
                                    id="phone" 
                                    value={user.phone} 
                                    onChange={e => handleUserChange('phone', e.target.value)} 
                                />
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button type="submit" isLoading={isSaving} className="!px-10 !rounded-2xl !py-4 shadow-xl shadow-indigo-100 font-black uppercase tracking-widest text-xs">
                                    Sync Profile Telemetry
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Preferences & Security */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Notification Protocols" className="!p-8 !rounded-[2.5rem] shadow-lg border-0">
                            <div className="space-y-6">
                                <ToggleSwitch
                                    label="Weekly Performance Summary"
                                    description="Executive summary of fiscal metrics."
                                    enabled={notifications.weeklySummary}
                                    setEnabled={(val) => setNotifications(p => ({ ...p, weeklySummary: val }))}
                                />
                                <ToggleSwitch
                                    label="Engine Status Updates"
                                    description="Notices on new AI capabilities."
                                    enabled={notifications.productUpdates}
                                    setEnabled={(val) => setNotifications(p => ({ ...p, productUpdates: val }))}
                                />
                                <ToggleSwitch
                                    label="Security Breach Alerts"
                                    description="Instant notification on identity events."
                                    enabled={notifications.securityAlerts}
                                    setEnabled={(val) => setNotifications(p => ({ ...p, securityAlerts: val }))}
                                />
                            </div>
                        </Card>

                        <Card title="Access Security" className="!p-8 !rounded-[2.5rem] shadow-lg border-0 bg-white">
                            <div className="space-y-6">
                                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"Regularly cycling your authorization credentials improves account integrity."</p>
                                <Input label="Current Token" type="password" id="cur" placeholder="••••••••" />
                                <Input label="New Token Signature" type="password" id="new" placeholder="••••••••" />
                                <Button variant="secondary" className="w-full !rounded-xl !py-3 font-black uppercase tracking-widest text-[10px]">Update Credentials</Button>
                            </div>
                        </Card>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-10 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-rose-200/20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h4 className="text-lg font-black text-rose-800 tracking-tight">Identity Termination</h4>
                            <p className="text-sm text-rose-700 font-medium italic mt-1 leading-relaxed max-w-sm">Warning: This action will permanently purge all client, invoice, and expense telemetry from your local storage.</p>
                        </div>
                        <Button 
                            variant="danger" 
                            onClick={() => {
                                setConfirmConfig({
                                    isOpen: true,
                                    title: "Identity Termination",
                                    message: "Final Warning: Data destruction is irreversible. Proceed?",
                                    variant: 'danger',
                                    onConfirm: () => {
                                        localStorage.clear();
                                        window.location.reload();
                                    }
                                });
                            }}
                            className="!px-8 !rounded-2xl !py-4 font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-200 relative z-10"
                        >
                            Purge Data
                        </Button>
                    </div>
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

export default UserProfile;