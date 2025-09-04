
import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import TextArea from './common/TextArea';
import { suggestCompanyNames } from '../services/geminiService';
import type { CompanyRegistrationData, Director } from '../types';

const DirectorForm: React.FC<{ director: Director; onUpdate: (director: Director) => void; onRemove: (id: string) => void; index: number }> = ({ director, onUpdate, onRemove, index }) => {
    
    const handleChange = (field: keyof Omit<Director, 'id'>, value: string) => {
        onUpdate({ ...director, [field]: value });
    };

    return (
        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">Director {index + 1}</h4>
                <Button variant="danger" onClick={() => onRemove(director.id)} className="!py-1 !px-2">Remove</Button>
            </div>
            <Input label="Full Name" id={`fullName-${director.id}`} value={director.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor={`idType-${director.id}`} className="block text-sm font-medium text-gray-700">ID Type</label>
                    <select id={`idType-${director.id}`} value={director.identificationType} onChange={e => handleChange('identificationType', e.target.value as 'SA ID' | 'Passport')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>SA ID</option>
                        <option>Passport</option>
                    </select>
                </div>
                <Input label="ID / Passport Number" id={`idNumber-${director.id}`} value={director.identificationNumber} onChange={e => handleChange('identificationNumber', e.target.value)} required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <Input label="Email" id={`email-${director.id}`} type="email" value={director.email} onChange={e => handleChange('email', e.target.value)} required />
                <Input label="Phone Number" id={`phone-${director.id}`} value={director.phone} onChange={e => handleChange('phone', e.target.value)} required />
            </div>
            <TextArea label="Physical Address" id={`physicalAddress-${director.id}`} value={director.physicalAddress} onChange={e => handleChange('physicalAddress', e.target.value)} rows={2} required />
            <TextArea label="Postal Address" id={`postalAddress-${director.id}`} value={director.postalAddress} onChange={e => handleChange('postalAddress', e.target.value)} rows={2} required />
        </div>
    );
};


const CompanyRegistration: React.FC = () => {
    const [nameSuggestionDescription, setNameSuggestionDescription] = useState('An online store selling handmade leather goods in South Africa');
    const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState('');
    
    const [formData, setFormData] = useState<CompanyRegistrationData>({
        names: { name1: '', name2: '', name3: '', name4: '' },
        businessPhysicalAddress: '',
        businessPostalAddress: '',
        yearEnd: 'February',
        directors: [],
        primaryContact: { name: '', email: '' }
    });

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
        setFormData(prev => ({
            ...prev,
            directors: prev.directors.filter(d => d.id !== id)
        }));
    };
    
    const handleUseSuggestedName = (name: string) => {
        const currentNames = formData.names;
        if (!currentNames.name1) {
            handleNestedFormChange('names', 'name1', name);
        } else if (!currentNames.name2) {
            handleNestedFormChange('names', 'name2', name);
        } else if (!currentNames.name3) {
            handleNestedFormChange('names', 'name3', name);
        } else if (!currentNames.name4) {
            handleNestedFormChange('names', 'name4', name);
        } else {
            handleNestedFormChange('names', 'name4', name);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Company Registration Data:', formData);
        alert('Registration submitted successfully! (Check console for data)');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
             <Card title="Step 1: Get Company Name Suggestions (Optional)">
                <div className="space-y-4">
                    <TextArea
                        label="Describe your business"
                        id="businessDescription"
                        value={nameSuggestionDescription}
                        onChange={e => setNameSuggestionDescription(e.target.value)}
                        rows={3}
                    />
                    <Button onClick={handleNameSuggestion} isLoading={isSuggesting} className="w-full">
                        Suggest Names
                    </Button>
                    {suggestionError && <p className="text-red-500 text-sm">{suggestionError}</p>}
                    {suggestedNames.length > 0 && (
                        <div className="pt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Suggestions:</h4>
                            <div className="flex flex-wrap gap-2">
                                {suggestedNames.map(name => (
                                    <button 
                                        key={name} 
                                        onClick={() => handleUseSuggestedName(name)}
                                        className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                                        title={`Use "${name}" in form`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Step 2: Company Details">
                    <div className="space-y-6">
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-gray-900 pb-2 w-full">Proposed Company Names</legend>
                            <p className="text-sm text-gray-600">Provide up to 4 names in order of preference.</p>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Name 1 (Highest Preference)" id="name1" value={formData.names.name1} onChange={e => handleNestedFormChange('names', 'name1', e.target.value)} required />
                                <Input label="Name 2" id="name2" value={formData.names.name2} onChange={e => handleNestedFormChange('names', 'name2', e.target.value)} />
                                <Input label="Name 3" id="name3" value={formData.names.name3} onChange={e => handleNestedFormChange('names', 'name3', e.target.value)} />
                                <Input label="Name 4" id="name4" value={formData.names.name4} onChange={e => handleNestedFormChange('names', 'name4', e.target.value)} />
                             </div>
                        </fieldset>
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-gray-900 border-t border-gray-100 pt-4 pb-2 w-full">Business Address</legend>
                            <TextArea label="Physical Address" id="businessPhysicalAddress" value={formData.businessPhysicalAddress} onChange={e => setFormData(p => ({...p, businessPhysicalAddress: e.target.value}))} required />
                            <TextArea label="Postal Address" id="businessPostalAddress" value={formData.businessPostalAddress} onChange={e => setFormData(p => ({...p, businessPostalAddress: e.target.value}))} required />
                        </fieldset>
                        <fieldset className="space-y-4">
                             <legend className="text-lg font-semibold text-gray-900 border-t border-gray-100 pt-4 pb-2 w-full">Financial Year End</legend>
                             <div>
                                <label htmlFor="yearEnd" className="block text-sm font-medium text-gray-700">Select Month</label>
                                <select
                                    id="yearEnd"
                                    value={formData.yearEnd}
                                    onChange={e => setFormData(p => ({...p, yearEnd: e.target.value}))}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                        </fieldset>
                    </div>
                </Card>

                <Card title="Step 3: Director(s) Information">
                    <div className="space-y-4">
                        {formData.directors.map((director, index) => (
                           <DirectorForm 
                                key={director.id} 
                                director={director} 
                                onUpdate={updateDirector} 
                                onRemove={removeDirector}
                                index={index}
                           />
                        ))}
                         <Button type="button" variant="secondary" onClick={addDirector}>Add Director</Button>
                         {formData.directors.length === 0 && <p className="text-sm text-red-600">You must add at least one director.</p>}
                    </div>
                </Card>

                 <Card title="Step 4: Primary Contact">
                    <div className="space-y-4">
                        <Input label="Contact Person Full Name" id="primaryContactName" value={formData.primaryContact.name} onChange={e => handleNestedFormChange('primaryContact', 'name', e.target.value)} required />
                        <Input label="Contact Person Email" id="primaryContactEmail" type="email" value={formData.primaryContact.email} onChange={e => handleNestedFormChange('primaryContact', 'email', e.target.value)} required />
                    </div>
                </Card>

                <Card>
                    <p className="text-sm text-gray-600 mb-4">Disclaimer: This is a simplified form for demonstration purposes and does not constitute a legal company registration with CIPC. Review all information carefully before submitting.</p>
                    <Button type="submit" className="w-full" disabled={formData.directors.length === 0}>
                        Submit Registration
                    </Button>
                </Card>
            </form>
        </div>
    );
};

export default CompanyRegistration;
