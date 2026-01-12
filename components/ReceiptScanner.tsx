
import React, { useState, useEffect, useMemo } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import FileUpload from './common/FileUpload';
import Spinner from './common/Spinner';
import { analyzeReceipt } from '../services/geminiService';
import type { Expense } from '../types';

const STORAGE_KEY = 'sme-pal-expenses';

const ReceiptScanner: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [scanProgress, setScanProgress] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setExpenses(JSON.parse(stored));
        }
    }, []);

    const saveExpenses = (newExpenses: Expense[]) => {
        setExpenses(newExpenses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
    };

    const handleFileSelect = (file: File) => {
        setCurrentFile(file);
        setError('');
        setScanProgress(0);
    };

    const totalSpend = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        expenses.forEach(e => {
            stats[e.category] = (stats[e.category] || 0) + e.amount;
        });
        return Object.entries(stats).sort((a, b) => b[1] - a[1]);
    }, [expenses]);

    const handleProcessReceipt = async () => {
        if (!currentFile) return;

        setIsProcessing(true);
        setError('');
        
        const timer = setInterval(() => {
            setScanProgress(p => p < 90 ? p + 10 : p);
        }, 300);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                try {
                    const analysis = await analyzeReceipt(base64String, currentFile.type);
                    setScanProgress(100);
                    
                    const newExpense: Expense = {
                        id: crypto.randomUUID(),
                        ...analysis,
                        date: analysis.date || new Date().toISOString().split('T')[0]
                    };

                    setTimeout(() => {
                        saveExpenses([newExpense, ...expenses]);
                        setCurrentFile(null);
                        setIsProcessing(false);
                        clearInterval(timer);
                    }, 500);
                } catch (err: any) {
                    setError(err.message);
                    setIsProcessing(false);
                    clearInterval(timer);
                }
            };
            reader.readAsDataURL(currentFile);
        } catch (e) {
            setError("Friction in file ingestion.");
            setIsProcessing(false);
            clearInterval(timer);
        }
    };

    const deleteExpense = (id: string) => {
        if (window.confirm("Archive this financial record?")) {
            saveExpenses(expenses.filter(e => e.id !== id));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-16 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Audit Studio</h1>
                    <p className="text-slate-500 font-medium italic">"Real-time OCR extraction for SARS-compliant records."</p>
                </div>
                <div className="flex gap-4">
                     <div className="bg-indigo-600 px-8 py-4 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Deductibles</p>
                        <p className="text-2xl font-black">R {totalSpend.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Extraction Terminal" className="!rounded-[2.5rem] !p-10 shadow-2xl border-0 overflow-hidden relative">
                        {isProcessing && (
                             <div className="absolute inset-x-0 top-0 h-1 bg-indigo-100">
                                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                             </div>
                        )}
                        <div className="space-y-6">
                            <p className="text-sm font-medium text-slate-500 italic">"Inject photographic data for digital analysis."</p>
                            <FileUpload
                                label="High-Res Receipt (JPG, PNG)"
                                id="receipt-upload"
                                onFileSelect={handleFileSelect}
                                onFileRemove={() => setCurrentFile(null)}
                                acceptedFileTypes="image/jpeg, image/png, image/webp"
                                currentFile={currentFile}
                                maxSizeMB={4}
                            />
                            <Button 
                                onClick={handleProcessReceipt} 
                                disabled={!currentFile || isProcessing} 
                                isLoading={isProcessing} 
                                className="w-full !rounded-2xl !py-5 shadow-2xl shadow-indigo-50 text-base font-black uppercase tracking-widest"
                            >
                                {isProcessing ? 'SCANNING PAYLOAD...' : 'EXTRACT DATA'}
                            </Button>
                            {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 p-4 rounded-xl border border-rose-100 animate-pulse">{error}</p>}
                        </div>
                    </Card>

                    {expenses.length > 0 && (
                        <Card title="Category Distribution" className="!p-8 bg-white border-0 shadow-sm">
                            <div className="space-y-6">
                                {categoryStats.map(([cat, amount]) => (
                                    <div key={cat} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</span>
                                            <span className="text-xs font-black text-slate-800">R {amount.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                                                style={{ width: `${(amount / totalSpend) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* List Section */}
                <div className="lg:col-span-8">
                    <Card title="Audit Transaction Log" className="!rounded-[3rem] !p-0 shadow-2xl border-0 overflow-hidden min-h-[600px] flex flex-col bg-white">
                        {expenses.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-32">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-lg font-black text-slate-800 tracking-tight">Database Static.</p>
                                <p className="text-xs font-black uppercase tracking-widest mt-2 text-slate-400">Zero records detected in local telemetry</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-50">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchant Signature</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact (ZAR)</th>
                                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-50">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id} className="group hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-6 text-xs font-bold text-slate-400 whitespace-nowrap">{new Date(expense.date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-700 tracking-tight">{expense.merchant}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 line-clamp-1">{expense.description || 'Verified via Neural OCR'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-black text-slate-800 text-right font-mono">
                                                    - R {expense.amount.toFixed(2)}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => deleteExpense(expense.id)} 
                                                        className="p-2.5 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReceiptScanner;
