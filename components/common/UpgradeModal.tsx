import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CreditCard, Building2, Mail, CheckCircle2 } from 'lucide-react';
import Button from './Button';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'info' | 'eft' | 'success'>('info');

    if (!isOpen) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a local toast here, but keeping it simple for the modal
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                    className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="w-32 h-32 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black tracking-tight mb-2">Upgrade to Professional</h2>
                            <p className="text-indigo-100 font-medium">Unlock the full power of the Neural Core.</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto">
                        {step === 'info' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        'Unlimited Invoices',
                                        'Full Compliance Engine',
                                        'Automated Tax Reminders',
                                        'Priority Support',
                                        'Custom Branding',
                                        'Advanced Analytics'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm font-bold text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                                    <h4 className="text-amber-900 font-black mb-2 text-sm">Payment Gateway Pending</h4>
                                    <p className="text-amber-700 text-xs leading-relaxed">
                                        We are currently finalizing our automated payment gateway integration. In the meantime, you can upgrade immediately via a secure manual EFT.
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription</p>
                                        <p className="text-2xl font-black text-slate-900">R299 <span className="text-sm text-slate-500 font-bold">/month</span></p>
                                    </div>
                                    <Button onClick={() => setStep('eft')} className="!px-8 !py-4 shadow-xl shadow-indigo-100">
                                        Pay via EFT
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 'eft' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Manual EFT Instructions</h3>
                                    <p className="text-sm text-slate-500">Please transfer R299 to the following account. Your account will be upgraded within 2-4 hours of the funds clearing.</p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                                    {[
                                        { label: 'Bank', value: 'First National Bank (FNB)' },
                                        { label: 'Account Name', value: 'SMEPal (Pty) Ltd' },
                                        { label: 'Account Number', value: '62812345678' },
                                        { label: 'Branch Code', value: '250655' },
                                        { label: 'Reference', value: 'PRO-[Your Company Name]' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-slate-200/50 pb-4 last:border-0 last:pb-0">
                                            <span className="text-xs font-bold text-slate-500">{item.label}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black text-slate-900">{item.value}</span>
                                                <button 
                                                    onClick={() => handleCopy(item.value)}
                                                    className="text-indigo-600 hover:text-indigo-800 text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="secondary" onClick={() => setStep('info')} className="flex-1">Back</Button>
                                    <Button onClick={() => setStep('success')} className="flex-1">I Have Paid</Button>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center space-y-6 py-8 animate-fade-in">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Upgrade Requested</h3>
                                    <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">
                                        Thank you! Our team is monitoring the account. Once the EFT clears, your workspace will automatically unlock all Professional features.
                                    </p>
                                </div>
                                <Button onClick={onClose} className="!px-10">Return to Dashboard</Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
