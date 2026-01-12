import React, { useState, useEffect, useMemo } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { generateInvoiceHtml } from '../services/geminiService';
import type { InvoiceDetails, InvoiceItem, InvoiceTheme } from '../types';
import { useClients } from '../hooks/useClients';
import type { ToastType } from './common/Toast';

declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

const STORAGE_KEYS = {
    LAST_NUMBER: 'sme-pal-last-invoice-number',
    HISTORY: 'sme-pal-invoice-history'
};

const DEFAULT_INVOICE_NUMBER = 'INV-1001';

const getNextInvoiceNumber = (currentNumber: string): string => {
    const numberMatch = currentNumber.match(/\d+$/);
    if (!numberMatch) return `${currentNumber}-1`;
    const numStr = numberMatch[0];
    const prefix = currentNumber.substring(0, currentNumber.length - numStr.length);
    const num = parseInt(numStr, 10) + 1;
    return `${prefix}${String(num).padStart(numStr.length, '0')}`;
};

const formatCurrency = (val: number) => {
    return val.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
};

interface InvoiceGeneratorProps {
    showToast: (m: string, t: ToastType) => void;
}

const THEMES: { id: InvoiceTheme; name: string; color: string }[] = [
    { id: 'standard', name: 'Classic Pro', color: 'indigo' },
    { id: 'modern', name: 'Ultra Modern', color: 'violet' },
    { id: 'minimal', name: 'Clean Minimal', color: 'slate' },
    { id: 'bold', name: 'High Impact', color: 'rose' }
];

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ showToast }) => {
    const [details, setDetails] = useState<InvoiceDetails>(() => {
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 30);
        
        // Load defaults from settings
        const settingsStr = localStorage.getItem('smepal_app_settings');
        const settings = settingsStr ? JSON.parse(settingsStr) : {};

        return {
            fromName: 'Your Business Name',
            fromAddress: 'South Africa Office',
            fromBusinessNumber: settings.companyRegNumber || '',
            fromVatNumber: settings.companyVatNumber || '',
            invoiceNumber: DEFAULT_INVOICE_NUMBER,
            date: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            bankDetails: settings.defaultBankDetails || '',
            paymentTerms: settings.defaultPaymentTerms || 'Payment is due within 30 days.',
            items: [{ id: 1, description: 'Consulting Services', quantity: 1, unitPrice: 1500 }],
            notes: '',
            theme: 'standard',
        } as InvoiceDetails;
    });

    const [loading, setLoading] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [history, setHistory] = useState<InvoiceDetails[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const { clients } = useClients();

    // Persistence & History
    useEffect(() => {
        const last = localStorage.getItem(STORAGE_KEYS.LAST_NUMBER);
        if (last) setDetails(prev => ({ ...prev, invoiceNumber: prev.invoiceNumber === DEFAULT_INVOICE_NUMBER ? getNextInvoiceNumber(last) : prev.invoiceNumber }));
        
        const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (storedHistory) setHistory(JSON.parse(storedHistory));
    }, []);

    const saveToHistory = (item: InvoiceDetails) => {
        const updated = [item, ...history.filter(h => h.invoiceNumber !== item.invoiceNumber)].slice(0, 10);
        setHistory(updated);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    };

    const loadFromHistory = (item: InvoiceDetails) => {
        setDetails(item);
        setGeneratedHtml('');
        setShowHistory(false);
        showToast(`Loaded ${item.invoiceNumber} template.`, "info");
    };

    const updateDetail = (field: keyof InvoiceDetails, value: any) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
        setDetails(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const addItem = () => {
        setDetails(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }]
        }));
    };

    const grandTotal = useMemo(() => {
        return details.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }, [details.items]);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const html = await generateInvoiceHtml(details);
            setGeneratedHtml(html);
            saveToHistory(details);
            showToast("Invoice architecture generated successfully.", "success");
        } catch (err: any) {
            showToast(err.message || "Engine failure during generation.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!generatedHtml) return;
        setIsExportingPdf(true);
        try {
            const el = document.getElementById('invoice-preview-container');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const canvas = await window.html2canvas(el, { scale: 2, useCORS: true });
            const img = canvas.toDataURL('image/png');
            pdf.addImage(img, 'PNG', 10, 10, 190, (190 * canvas.height) / canvas.width);
            pdf.save(`Invoice-${details.invoiceNumber}.pdf`);
            localStorage.setItem(STORAGE_KEYS.LAST_NUMBER, details.invoiceNumber);
            showToast("Document exported successfully.", "success");
        } catch (err) {
            showToast("PDF Export failed.", "error");
        } finally {
            setIsExportingPdf(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in relative">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* STUDIO CONTROLS */}
                <div className="w-full lg:w-[450px] space-y-8 lg:sticky lg:top-24">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Invoice Studio</h1>
                            <p className="text-sm font-medium text-slate-500 italic">"Design professional billing in seconds."</p>
                        </div>
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                            title="Draft History"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    </div>

                    <Card className="rounded-[2.5rem] border-0 shadow-xl overflow-hidden p-0">
                        <div className="bg-indigo-600 p-8 text-white">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-4">Branding & Style</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {THEMES.map(t => (
                                    <button 
                                        key={t.id} 
                                        onClick={() => updateDetail('theme', t.id)}
                                        className={`px-4 py-3 rounded-xl text-xs font-black transition-all border ${details.theme === t.id ? 'bg-white text-indigo-600 border-white shadow-lg' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 space-y-8 bg-white dark:bg-slate-800">
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-700 pb-2">Entity Details</h3>
                                <div className="space-y-4">
                                    <Input label="Business Name" id="fromName" value={details.fromName} onChange={e => updateDetail('fromName', e.target.value)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Reg No." id="freg" value={details.fromBusinessNumber} onChange={e => updateDetail('fromBusinessNumber', e.target.value)} />
                                        <Input label="VAT No." id="fvat" value={details.fromVatNumber} onChange={e => updateDetail('fromVatNumber', e.target.value)} />
                                    </div>
                                    <Input label="Invoice #" id="invNo" value={details.invoiceNumber} onChange={e => updateDetail('invoiceNumber', e.target.value)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Date" type="date" id="invDate" value={details.date} onChange={e => updateDetail('date', e.target.value)} />
                                        <Input label="Due Date" type="date" id="dueDate" value={details.dueDate} onChange={e => updateDetail('dueDate', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Recipient</label>
                                        <select 
                                            onChange={e => {
                                                const c = clients.find(cl => cl.id === e.target.value);
                                                if(c) { updateDetail('toName', c.name); updateDetail('toAddress', c.address); }
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm dark:text-white transition-all outline-none"
                                        >
                                            <option value="">Select Saved Client</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-700 pb-2">Line Items</h3>
                                <div className="space-y-3">
                                    {details.items.map((item, idx) => (
                                        <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 group relative">
                                            <div className="grid grid-cols-12 gap-3">
                                                <input 
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                                    className="col-span-12 bg-transparent font-bold text-slate-700 dark:text-white outline-none placeholder:text-slate-300"
                                                />
                                                <div className="col-span-4 flex items-center gap-2 bg-white dark:bg-slate-600 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-500">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase">Qty</span>
                                                    <input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))} className="w-full text-xs font-bold outline-none dark:text-white" />
                                                </div>
                                                <div className="col-span-4 flex items-center gap-2 bg-white dark:bg-slate-600 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-500">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase">ZAR</span>
                                                    <input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))} className="w-full text-xs font-bold outline-none dark:text-white" />
                                                </div>
                                                <div className="col-span-4 flex flex-col items-end justify-center">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase text-indigo-500">Line Total</span>
                                                    <span className="text-xs font-black text-slate-700 dark:text-white">{formatCurrency(item.quantity * item.unitPrice)}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => updateDetail('items', details.items.filter(i => i.id !== item.id))}
                                                className="absolute -right-2 -top-2 h-6 w-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={addItem} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all">+ Add Line Item</button>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 dark:border-slate-700 pb-2">Financial Protocol</h3>
                                <TextArea label="Banking Details" id="bank" value={details.bankDetails} onChange={e => updateDetail('bankDetails', e.target.value)} rows={3} />
                                <TextArea label="Payment Terms" id="pterms" value={details.paymentTerms} onChange={e => updateDetail('paymentTerms', e.target.value)} rows={2} />
                            </section>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total Estimate</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{formatCurrency(grandTotal)}</p>
                                </div>
                            </div>

                            <Button onClick={handleGenerate} isLoading={loading} className="w-full !rounded-2xl !py-5 shadow-2xl shadow-indigo-100 text-base">Generate Document</Button>
                        </div>
                    </Card>
                </div>

                {/* PAPER PREVIEW */}
                <div className="flex-1 w-full relative">
                     <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Document Canvas</h3>
                        {generatedHtml && (
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => window.print()} className="!py-2 !px-4 text-xs bg-white border-slate-200">Print</Button>
                                <Button onClick={handleExport} isLoading={isExportingPdf} className="!py-2 !px-4 text-xs">Download PDF</Button>
                            </div>
                        )}
                     </div>

                     <div className="bg-slate-200/30 dark:bg-slate-900/50 rounded-[2.5rem] p-4 sm:p-12 shadow-inner min-h-[842px] flex justify-center overflow-hidden">
                        {generatedHtml ? (
                            <div 
                                id="invoice-preview-container"
                                className="w-full max-w-[210mm] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden animate-scale-in origin-top"
                                dangerouslySetInnerHTML={{ __html: generatedHtml }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 text-center space-y-4 py-32">
                                <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                                    <svg className="h-10 w-10 text-slate-200 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-lg font-black text-slate-800 dark:text-slate-400 tracking-tight">Studio Idle.</p>
                                <p className="text-sm font-medium max-w-xs">Fill out the details on the left and click "Generate Document" to build your PDF.</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>

            {/* HISTORY DRAWER */}
            {showHistory && (
                <>
                    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setShowHistory(false)}></div>
                    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-2xl z-[70] p-8 border-l border-slate-100 dark:border-slate-700 animate-slide-in-right overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Draft History</h4>
                            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        {history.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No recent drafts found.</p>
                        ) : (
                            <div className="space-y-4">
                                {history.map((h, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => loadFromHistory(h)}
                                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-600 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black text-slate-800 dark:text-white">{h.invoiceNumber}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{h.date}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase truncate">{h.toName || 'Unnamed Recipient'}</p>
                                        <p className="mt-2 text-xs font-black text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Load Template →</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoiceGenerator;