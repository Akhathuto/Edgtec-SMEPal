import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import { validateIdNumber } from '../utils/validation';
import { verifyDirectorDetails } from '../services/geminiService';
import type { DirectorVerificationResult } from '../types';

const ResultDisplay: React.FC<{ result: DirectorVerificationResult }> = ({ result }) => {
    const statusClasses = {
        'Verified': 'bg-green-100 text-green-800',
        'Attention Required': 'bg-yellow-100 text-yellow-800',
        'Invalid': 'bg-red-100 text-red-800',
    };
    const statusIcons = {
        'Verified': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        'Attention Required': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        'Invalid': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    }

    return (
        <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Verification Report</h2>
            <div className="space-y-6">
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${statusClasses[result.status]}`}>
                    {statusIcons[result.status]}
                    <div>
                        <p className="font-semibold">{result.status}</p>
                        <p className="text-sm">{result.message}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-md font-semibold text-gray-700">Recommended Next Steps</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                        {result.recommendations.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-md font-semibold text-gray-700">Common Issues to Check</h3>
                     <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                        {result.commonIssues.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                
                <div className="text-xs text-gray-500 bg-slate-50 p-3 rounded-md">
                    <span className="font-semibold">Disclaimer:</span> {result.disclaimer}
                </div>
            </div>
        </Card>
    );
}


const DirectorVerification: React.FC = () => {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DirectorVerificationResult | null>(null);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        const clientValidationError = validateIdNumber('SA ID', idNumber);
        
        try {
            const verificationResult = await verifyDirectorDetails(name, idNumber, clientValidationError);
            setResult(verificationResult);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Director Verification Assistant</h2>
                <p className="text-gray-600 mb-6">
                    Enter a director's details to perform a preliminary check on their SA ID number and get AI-powered guidance for the official verification process.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Director's Full Name (as per ID)"
                        id="directorName"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g., Jane Naledi Doe"
                        required
                    />
                    <Input
                        label="South African ID Number"
                        id="idNumber"
                        value={idNumber}
                        onChange={e => setIdNumber(e.target.value)}
                        placeholder="13-digit number"
                        maxLength={13}
                        required
                    />
                    <Button type="submit" isLoading={loading} className="w-full">
                        Verify Details
                    </Button>
                </form>
            </Card>

            {loading && <Card><div className="text-center text-slate-600 p-8">Analyzing details and generating report...</div></Card>}
            {error && <Card><div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div></Card>}
            {result && <ResultDisplay result={result} />}
        </div>
    );
};

export default DirectorVerification;
