import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { calculateTax } from '../services/geminiService';
import type { TaxCalculationResult } from '../types';

const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return '0.00';
    const num = Number(value);
    if (isNaN(num)) return String(value); // Return original string if not a number
    return num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// FIX: Removed explicit React.FC type to fix cascading type errors.
const TaxCalculator = () => {
    const [income, setIncome] = useState<number>(500000);
    const [expenses, setExpenses] = useState<number>(120000);
    const [deductions, setDeductions] = useState<number>(35000);
    const [credits, setCredits] = useState<number>(17235);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TaxCalculationResult | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const taxResult = await calculateTax(income, expenses, deductions, credits);
            setResult(taxResult);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Tax Estimator</h2>
                        <p className="text-slate-600 mb-6">Enter your annual income, expenses, and any applicable deductions or credits for a more personalized tax estimate. This is for informational purposes only.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Annual Gross Income (R)"
                                id="income"
                                type="number"
                                value={income}
                                onChange={e => setIncome(Number(e.target.value))}
                                required
                            />
                            <Input
                                label="Annual Business Expenses (R)"
                                id="expenses"
                                type="number"
                                value={expenses}
                                onChange={e => setExpenses(Number(e.target.value))}
                                required
                            />
                             <Input
                                label="Annual Deductions (R)"
                                id="deductions"
                                type="number"
                                value={deductions}
                                onChange={e => setDeductions(Number(e.target.value))}
                                placeholder="e.g., retirement, medical"
                                required
                            />
                            <Input
                                label="Annual Tax Credits/Rebates (R)"
                                id="credits"
                                type="number"
                                value={credits}
                                onChange={e => setCredits(Number(e.target.value))}
                                placeholder="e.g., primary rebate"
                                required
                            />
                            <Button type="submit" isLoading={loading} className="w-full !py-3">
                                Calculate Tax
                            </Button>
                        </form>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg min-h-[350px] flex flex-col justify-center">
                         {loading && (
                            <div className="text-center text-slate-600">
                                <Spinner />
                                <p className="mt-2">Calculating...</p>
                            </div>
                        )}
                         {error && <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>}
                         {result && (
                            <div className="space-y-6 text-center">
                                <h3 className="text-lg font-semibold text-slate-800">Estimated Results</h3>
                                <div>
                                    <p className="text-sm text-slate-500">Net Taxable Income</p>
                                    <p className="text-3xl font-bold text-indigo-600">R {formatCurrency(result.taxableIncome)}</p>
                                </div>
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="text-sm text-slate-500">Estimated Tax Due (After Credits)</p>
                                    <p className="text-4xl font-extrabold text-slate-800">R {formatCurrency(result.estimatedTax)}</p>
                                </div>
                                <div className="pt-2 text-left">
                                     <h4 className="text-sm font-semibold text-slate-700 mb-2">Notes:</h4>
                                     <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                         {result.notes.map((note, index) => <li key={index}>{note}</li>)}
                                     </ul>
                                </div>
                            </div>
                         )}
                         {!loading && !result && !error && (
                            <div className="text-center text-slate-500">
                                <div className="mx-auto h-12 w-12 text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 21V5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25v15.75M5.25 21H18.75" />
                                    </svg>
                                </div>
                                <p className="mt-2 font-medium">Your tax estimation will appear here.</p>
                            </div>
                         )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TaxCalculator;