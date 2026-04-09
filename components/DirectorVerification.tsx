import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import { validateIdNumber } from '../utils/validation';
import { verifyDirectorDetails } from '../services/geminiService';
import type { DirectorVerificationResult } from '../types';

// Helper to extract info from a valid SA ID
const extractIdInfo = (idNumber: string) => {
    if (idNumber.length !== 13) return null;
    
    const yearStr = idNumber.substring(0, 2);
    const month = idNumber.substring(2, 4);
    const day = idNumber.substring(4, 6);
    const genderCode = parseInt(idNumber.substring(6, 10), 10);
    const citizenshipCode = parseInt(idNumber.substring(10, 11), 10);

    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100);
    const yearInt = parseInt(yearStr, 10);
    const fullYear = yearInt > (currentYear % 100) ? (currentCentury - 1) * 100 + yearInt : currentCentury * 100 + yearInt;

    return {
        dob: `${fullYear}-${month}-${day}`,
        gender: genderCode >= 5000 ? 'Male' : 'Female',
        citizenship: citizenshipCode === 0 ? 'SA Citizen' : 'Permanent Resident'
    };
};

const ResultDisplay: React.FC<{ result: DirectorVerificationResult, idInfo?: ReturnType<typeof extractIdInfo> }> = ({ result, idInfo }) => {
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

                {idInfo && result.status !== 'Invalid' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Extracted ID Data</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Date of Birth</p>
                                <p className="font-bold text-slate-800">{idInfo.dob}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Gender</p>
                                <p className="font-bold text-slate-800">{idInfo.gender}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Status</p>
                                <p className="font-bold text-slate-800">{idInfo.citizenship}</p>
                            </div>
                        </div>
                    </div>
                )}

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
    const [idInfo, setIdInfo] = useState<ReturnType<typeof extractIdInfo> | undefined>(undefined);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        setIdInfo(undefined);

        const clientValidationError = validateIdNumber('SA ID', idNumber);
        
        try {
            const verificationResult = await verifyDirectorDetails(name, idNumber, clientValidationError);
            setResult(verificationResult);
            if (!clientValidationError) {
                setIdInfo(extractIdInfo(idNumber));
            }
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
                        tooltip="Enter the full name exactly as it appears in the South African ID book."
                    />
                    <Input
                        label="South African ID Number"
                        id="idNumber"
                        value={idNumber}
                        onChange={e => setIdNumber(e.target.value)}
                        placeholder="13-digit number"
                        maxLength={13}
                        required
                        tooltip="The 13-digit identity number. Do not include spaces."
                    />
                    <Button type="submit" isLoading={loading} className="w-full">
                        Verify Details
                    </Button>
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-indigo-50 border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-900 mb-2">Free Official CIPC Search</h3>
                    <p className="text-xs text-indigo-700 mb-4 leading-relaxed">
                        You can manually verify if a company or director is registered for free using the official government BizPortal.
                    </p>
                    <a 
                        href="https://bizportal.gov.za/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                        Open BizPortal <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </Card>

                <Card className="bg-slate-50 border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">How our free check works</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Our system uses the <strong>Luhn Algorithm</strong> to instantly verify if an ID number is mathematically valid and extracts the embedded Date of Birth, Gender, and Citizenship status without any API costs.
                    </p>
                </Card>
            </div>

            {loading && <Card><div className="text-center text-slate-600 p-8">Analyzing details and generating report...</div></Card>}
            {error && <Card><div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div></Card>}
            {result && <ResultDisplay result={result} idInfo={idInfo} />}
        </div>
    );
};

export default DirectorVerification;