import React, { useState, useMemo } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import TextArea from './common/TextArea';
import FileUpload from './common/FileUpload';
import { suggestCompanyNames } from '../services/geminiService';
import { CompanyRegistrationData, Director, CompanyType } from '../types';
import { validateIdNumber } from '../utils/validation';


const DirectorForm: React.FC<{ director: Director; onUpdate: (director: Director) => void; onRemove: (id: string) => void; index: number }> = ({ director, onUpdate, onRemove, index }) => {
    
    const [idError, setIdError] = useState<string | null>(null);

    const handleIdBlur = () => {
        const error = validateIdNumber(director.identificationType, director.identificationNumber);
        setIdError(error);
    };

    const handleChange = (field: keyof Omit<Director, 'id'>, value: string) => {
        if (field === 'identificationNumber' || field === 'identificationType') {
            setIdError(null);
        }
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
                    <select id={`idType-${director.id}`} value={director.identificationType} onChange={e => handleChange('identificationType', e.target.value as 'SA ID' | 'Passport')} onBlur={handleIdBlur} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>SA ID</option>
                        <option>Passport</option>
                    </select>
                </div>
                <div>
                    <Input label="ID / Passport Number" id={`idNumber-${director.id}`} value={director.identificationNumber} onChange={e => handleChange('identificationNumber', e.target.value)} onBlur={handleIdBlur} required className={idError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                    {idError && <p className="mt-1 text-xs text-red-600">{idError}</p>}
                </div>
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

const ReviewSection: React.FC<{ title: string; data: { label: string; value?: string }[] }> = ({ title, data }) => (
    <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{title}</h3>
        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {data.map(({ label, value }) => (
                value ? (
                    <div key={label} className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">{label}</dt>
                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{value}</dd>
                    </div>
                ) : null
            ))}
        </dl>
    </div>
);

const CompanyTypeCard: React.FC<{ type: string; description: string; onSelect: () => void; icon: JSX.Element }> = ({ type, description, onSelect, icon }) => (
    <div onClick={onSelect} className="group relative block cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:border-indigo-500 hover:shadow-lg transition-all duration-300 ease-in-out">
        <div className="absolute right-4 top-4 rounded-lg bg-white p-1 ring-1 ring-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
             <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 text-indigo-600">{icon}</div>
            <div>
                <h3 className="font-semibold text-gray-800">{type}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
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


const CompanyRegistration: React.FC = () => {
    const [step, setStep] = useState(0); // 0 for type selection
    const [nameSuggestionDescription, setNameSuggestionDescription] = useState('An online store selling handmade leather goods in South Africa');
    const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState('');
    
    const [formData, setFormData] = useState<CompanyRegistrationData>(initialFormData);

    const [paymentDetails, setPaymentDetails] = useState({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
    const [isPaying, setIsPaying] = useState(false);


    const steps = useMemo(() => [
        { id: 1, name: 'Company Names' },
        { id: 2, name: 'Business Details' },
        { id: 3, name: 'Directors' },
        { id: 4, name: 'Documents' },
        { id: 5, name: 'Primary Contact' },
        { id: 6, name: 'Review' },
        { id: 7, name: 'Payment' },
        { id: 8, name: 'Complete' }
    ], []);
    const totalSteps = steps.length;

    const handleSelectCompanyType = (type: CompanyType) => {
        setFormData(prev => ({ ...prev, companyType: type }));
        setStep(1);
    };
    
    const resetWizard = () => {
        setFormData(initialFormData);
        setStep(0);
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
    };
    
    const handleUseSuggestedName = (name: string) => {
        const { names } = formData;
        const newNames = { ...names };
        if (!names.name1) newNames.name1 = name;
        else if (!names.name2) newNames.name2 = name;
        else if (!names.name3) newNames.name3 = name;
        else if (!names.name4) newNames.name4 = name;
        else newNames.name4 = name; // Overwrite last one if all are full
        setFormData(prev => ({ ...prev, names: newNames }));
    };
    
    const nextStep = () => {
        // Validation before proceeding
        if (step === 1 && !formData.names.name1) {
            alert('Please provide at least one proposed company name.');
            return;
        }
        if (step === 2 && (!formData.businessPhysicalAddress || !formData.businessPostalAddress)) {
            alert('Please provide both physical and postal business addresses.');
            return;
        }
        if (step === 3 && formData.directors.length === 0) {
            alert('You must add at least one director.');
            return;
        }
        if (step === 4) {
            const allDocsUploaded = formData.directors.every(dir => !!formData.directorIdDocuments[dir.id]);
            if (!allDocsUploaded || !formData.businessAddressProof) {
                alert('Please upload all required documents.');
                return;
            }
        }
        if (step === 5) {
            if (!formData.primaryContact.name || !formData.primaryContact.email) {
                alert('Please provide the primary contact details.');
                return;
            }
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    
    const submitRegistrationData = () => {
        for (const director of formData.directors) {
            const error = validateIdNumber(director.identificationType, director.identificationNumber);
            if (error) {
                alert(`Error for Director ${director.fullName || ' '}: ${error}`);
                setStep(3); // Go back to director step
                return;
            }
        }

        console.log('Company Registration Data:', formData);
        // This is where you would send the data to a server in a real application.
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
            formattedValue = value.replace(/[^\d]/g, '').slice(0, 3);
        }
        setPaymentDetails(prev => ({ ...prev, [id]: formattedValue }));
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPaying(true);
        // Simulate API call to payment gateway
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        console.log('Payment successful. Submitting registration data...');
        submitRegistrationData();
        
        setIsPaying(false);
        setStep(8); // Go to the final "Complete" step
    };


    if (step === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Company Registration</h1>
                <p className="text-slate-600">First, let's choose the type of company you want to register.</p>
                <div className="space-y-4 pt-4 text-left">
                    <CompanyTypeCard
                        type={CompanyType.PRIVATE_COMPANY}
                        description="A for-profit company, the most common type for businesses in South Africa."
                        onSelect={() => handleSelectCompanyType(CompanyType.PRIVATE_COMPANY)}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    />
                    <CompanyTypeCard
                        type={CompanyType.NON_PROFIT_COMPANY}
                        description="For non-profit organisations (NPOs) established for public benefit or social objectives."
                        onSelect={() => handleSelectCompanyType(CompanyType.NON_PROFIT_COMPANY)}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg>}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                 <h1 className="text-2xl font-bold text-slate-800">Company Registration Wizard</h1>
                 <p className="text-slate-600">Registering a: <span className="font-semibold text-indigo-600">{formData.companyType}</span></p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow-sm">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {steps.map((s, index) => (
                            <li key={s.name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                                {step > s.id ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-indigo-600" />
                                        </div>
                                        <button onClick={() => setStep(s.id)} className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
                                            <span className="sr-only">{s.name}</span>
                                        </button>
                                    </>
                                ) : step === s.id ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white" aria-current="step">
                                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                                            <span className="sr-only">{s.name}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200" />
                                        </div>
                                        <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                                            <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                                            <span className="sr-only">{s.name}</span>
                                        </div>
                                    </>
                                )}
                                <div className="absolute -bottom-6 text-xs text-center w-20 -left-6 sm:w-auto sm:left-auto">{s.name}</div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
            
            <div>
                {step === 1 && (
                    <div className="space-y-6">
                        <Card title="Step 1: Get Company Name Suggestions (Optional)">
                            <div className="space-y-4">
                                <TextArea label="Describe your business" id="businessDescription" value={nameSuggestionDescription} onChange={e => setNameSuggestionDescription(e.target.value)} rows={3} />
                                <Button type="button" onClick={handleNameSuggestion} isLoading={isSuggesting} className="w-full">Suggest Names</Button>
                                {suggestionError && <p className="text-red-500 text-sm">{suggestionError}</p>}
                                {suggestedNames.length > 0 && (
                                    <div className="pt-4"><h4 className="font-semibold text-gray-800 mb-2">Suggestions:</h4><div className="flex flex-wrap gap-2">{suggestedNames.map(name => (<button key={name} type="button" onClick={() => handleUseSuggestedName(name)} className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors" title={`Use "${name}" in form`}>{name}</button>))}</div></div>
                                )}
                            </div>
                        </Card>
                        <Card title="Proposed Company Names">
                             <p className="text-sm text-gray-600 mb-4">Provide up to 4 names in order of preference.</p>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Name 1 (Highest Preference)" id="name1" value={formData.names.name1} onChange={e => handleNestedFormChange('names', 'name1', e.target.value)} required />
                                <Input label="Name 2" id="name2" value={formData.names.name2} onChange={e => handleNestedFormChange('names', 'name2', e.target.value)} />
                                <Input label="Name 3" id="name3" value={formData.names.name3} onChange={e => handleNestedFormChange('names', 'name3', e.target.value)} />
                                <Input label="Name 4" id="name4" value={formData.names.name4} onChange={e => handleNestedFormChange('names', 'name4', e.target.value)} />
                             </div>
                        </Card>
                    </div>
                )}

                {step === 2 && (
                     <Card title="Step 2: Business Details">
                        <div className="space-y-6">
                            <fieldset className="space-y-4">
                                <legend className="text-lg font-semibold text-gray-900 pb-2 w-full">Business Address</legend>
                                <TextArea label="Physical Address" id="businessPhysicalAddress" value={formData.businessPhysicalAddress} onChange={e => setFormData(p => ({...p, businessPhysicalAddress: e.target.value}))} required />
                                <TextArea label="Postal Address" id="businessPostalAddress" value={formData.businessPostalAddress} onChange={e => setFormData(p => ({...p, businessPostalAddress: e.target.value}))} required />
                            </fieldset>
                            <fieldset className="space-y-4">
                                <legend className="text-lg font-semibold text-gray-900 border-t border-gray-100 pt-4 pb-2 w-full">Financial Year End</legend>
                                <div>
                                    <label htmlFor="yearEnd" className="block text-sm font-medium text-gray-700">Select Month</label>
                                    <select id="yearEnd" value={formData.yearEnd} onChange={e => setFormData(p => ({...p, yearEnd: e.target.value}))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (<option key={month} value={month}>{month}</option>))}
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </Card>
                )}

                {step === 3 && (
                     <Card title="Step 3: Director(s) Information">
                        <div className="space-y-4">
                            {formData.directors.map((director, index) => (<DirectorForm key={director.id} director={director} onUpdate={updateDirector} onRemove={removeDirector} index={index}/>))}
                            <Button type="button" variant="secondary" onClick={addDirector}>Add Director</Button>
                            {formData.directors.length === 0 && <p className="text-sm text-red-600">You must add at least one director.</p>}
                        </div>
                    </Card>
                )}

                {step === 4 && (
                    <Card title="Step 4: Upload Documents">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-md font-semibold text-gray-900">Proof of Business Address</h3>
                                <p className="text-sm text-gray-500 mb-2">e.g., A utility bill not older than 3 months.</p>
                                <FileUpload
                                    label="PDF, PNG, JPG up to 5MB"
                                    id="business-address-proof"
                                    currentFile={formData.businessAddressProof}
                                    onFileSelect={(file) => setFormData(p => ({ ...p, businessAddressProof: file }))}
                                    onFileRemove={() => setFormData(p => ({ ...p, businessAddressProof: null }))}
                                />
                            </div>

                            {formData.directors.map((director) => (
                                <div key={director.id} className="pt-4 border-t border-gray-200">
                                    <h3 className="text-md font-semibold text-gray-900">Certified ID / Passport for {director.fullName || `Director ${formData.directors.indexOf(director) + 1}`}</h3>
                                    <p className="text-sm text-gray-500 mb-2">Must be a clear, certified copy not older than 3 months.</p>
                                     <FileUpload
                                        label="PDF, PNG, JPG up to 5MB"
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
                     <Card title="Step 5: Primary Contact">
                        <p className="text-sm text-gray-600 mb-4">Please provide the details of the primary contact person for this registration. This person will receive all correspondence.</p>
                        <div className="space-y-4">
                            <Input label="Contact Person Full Name" id="primaryContactName" value={formData.primaryContact.name} onChange={e => handleNestedFormChange('primaryContact', 'name', e.target.value)} required />
                            <Input label="Contact Person Email" id="primaryContactEmail" type="email" value={formData.primaryContact.email} onChange={e => handleNestedFormChange('primaryContact', 'email', e.target.value)} required />
                        </div>
                    </Card>
                )}

                {step === 6 && (
                    <Card title="Step 6: Review Your Application">
                        <ReviewSection title="Proposed Company Names" data={[
                            { label: 'Name 1', value: formData.names.name1 }, { label: 'Name 2', value: formData.names.name2 }, { label: 'Name 3', value: formData.names.name3 }, { label: 'Name 4', value: formData.names.name4 }
                        ]} />
                         <ReviewSection title="Business Details" data={[
                            { label: 'Company Type', value: formData.companyType }, { label: 'Physical Address', value: formData.businessPhysicalAddress }, { label: 'Postal Address', value: formData.businessPostalAddress }, { label: 'Financial Year End', value: formData.yearEnd }
                        ]} />
                        {formData.directors.map((dir, i) => (
                            <ReviewSection key={dir.id} title={`Director ${i+1} Details`} data={[
                                { label: 'Full Name', value: dir.fullName }, { label: 'ID/Passport', value: `${dir.identificationType} - ${dir.identificationNumber}` }, { label: 'Email', value: dir.email }, { label: 'Phone', value: dir.phone }, { label: 'Physical Address', value: dir.physicalAddress }, { label: 'Postal Address', value: dir.postalAddress }
                            ]} />
                        ))}
                         <ReviewSection title="Uploaded Documents" data={[
                            { label: 'Proof of Business Address', value: formData.businessAddressProof?.name || 'Not Uploaded' },
                            ...formData.directors.map(d => ({
                                label: `ID for ${d.fullName}`,
                                value: formData.directorIdDocuments[d.id]?.name || 'Not Uploaded'
                            }))
                        ]} />
                        <ReviewSection title="Primary Contact" data={[
                            { label: 'Full Name', value: formData.primaryContact.name }, { label: 'Email', value: formData.primaryContact.email }
                        ]} />
                         <p className="text-sm text-gray-600 mt-6">Please review all information carefully. Once you proceed to payment, you cannot go back.</p>
                    </Card>
                )}

                {step === 7 && (
                    <Card title="Step 7: Payment">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Company Registration Service</span>
                                        <span>R 499.00</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
                                        <span>Total Due</span>
                                        <span>R 499.00</span>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <Input label="Cardholder Name" id="cardholderName" value={paymentDetails.cardholderName} onChange={handlePaymentInputChange} required disabled={isPaying} />
                                <Input label="Card Number" id="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentInputChange} placeholder="0000 0000 0000 0000" required disabled={isPaying} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Expiry Date (MM/YY)" id="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentInputChange} placeholder="MM/YY" required disabled={isPaying} />
                                    <Input label="CVC" id="cvc" value={paymentDetails.cvc} onChange={handlePaymentInputChange} placeholder="123" required disabled={isPaying} />
                                </div>
                                <Button type="submit" isLoading={isPaying} className="w-full !py-3">
                                    {isPaying ? 'Processing Payment...' : 'Pay & Complete Registration'}
                                </Button>
                            </form>
                        </div>
                    </Card>
                )}

                {step === 8 && (
                    <Card>
                        <div className="text-center py-12">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <h3 className="mt-4 text-2xl font-semibold leading-6 text-gray-900">Registration Submitted!</h3>
                            <div className="mt-2">
                                <p className="text-md text-gray-600">
                                    Thank you! We have received your application and payment. We will begin processing it shortly and keep you updated via email.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Button onClick={resetWizard}>Start Another Registration</Button>
                            </div>
                        </div>
                    </Card>
                )}
                
                {step < 8 && (
                    <div className="flex justify-between items-center pt-6">
                        <div>
                            {step > 1 && (<Button type="button" variant="secondary" onClick={prevStep} disabled={isPaying}>Back</Button>)}
                            {step === 1 && (<Button type="button" variant="secondary" onClick={() => setStep(0)}>Change Type</Button>)}
                        </div>
                        <div>
                            {step < 6 && (<Button type="button" onClick={nextStep}>Next Step</Button>)}
                            {step === 6 && (<Button type="button" onClick={nextStep}>Proceed to Payment</Button>)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyRegistration;