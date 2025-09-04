import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';
import { generateInvoiceHtml } from '../services/geminiService';
import type { InvoiceDetails, InvoiceItem } from '../types';
import { useClients } from '../hooks/useClients';

const InvoiceGenerator: React.FC = () => {
    const [details, setDetails] = useState<InvoiceDetails>({
        fromName: 'Your Company Name',
        fromAddress: '123 Business Rd, Johannesburg, 2000',
        fromBusinessNumber: '',
        toName: '',
        toAddress: '',
        toVatNumber: '',
        invoiceNumber: 'INV-001',
        date: new Date().toISOString().split('T')[0],
        paymentTerms: 'Due upon receipt',
        items: [{ id: 1, description: 'Website Development', quantity: 1, unitPrice: 15000 }],
        notes: 'Payment is due within 30 days.',
        header: 'INVOICE',
        footer: 'Thank you for your business!',
        companyLogo: '',
    });
    const [loading, setLoading] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [error, setError] = useState('');
    const { clients } = useClients();

    const handleDetailChange = (field: keyof InvoiceDetails, value: string) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
        setDetails(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addItem = () => {
        setDetails(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }]
        }));
    };

    const removeItem = (id: number) => {
        setDetails(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };
    
    const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        const selectedClient = clients.find(c => c.id === clientId);
        if (selectedClient) {
            setDetails(prev => ({
                ...prev,
                toName: selectedClient.name,
                toAddress: selectedClient.address,
            }));
        } else {
            // Reset if they select the placeholder option
            setDetails(prev => ({
                ...prev,
                toName: '',
                toAddress: '',
                toVatNumber: '',
            }));
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file.');
          return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setError('Image size should be less than 2MB.');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          handleDetailChange('companyLogo', base64String);
          setError('');
        };
        reader.onerror = () => {
            setError('Failed to read the image file.');
        }
        reader.readAsDataURL(file);
      }
    };
    
    const removeLogo = () => {
        handleDetailChange('companyLogo', '');
        const fileInput = document.getElementById('companyLogoUpload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setGeneratedHtml('');
        try {
            const html = await generateInvoiceHtml(details);
            setGeneratedHtml(html);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Invoice Details" className="h-fit">
                <div className="space-y-6">
                    {/* FROM SECTION */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 w-full">From</legend>
                        <div>
                            <label htmlFor="companyLogoUpload" className="block text-sm font-medium text-gray-700">Company Logo (Optional)</label>
                             <div className="mt-1 flex items-center gap-4">
                                {details.companyLogo ? (
                                    <div className="flex items-center gap-2">
                                        <img src={details.companyLogo} alt="Company Logo Preview" className="h-16 w-16 object-contain border p-1 rounded-md bg-white" />
                                        <Button variant="danger" onClick={removeLogo} className="!py-1 !px-2">Remove</Button>
                                    </div>
                                ) : (
                                    <input
                                        id="companyLogoUpload"
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={handleLogoUpload}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                )}
                            </div>
                        </div>
                        <Input label="Your Name / Company" id="fromName" value={details.fromName} onChange={e => handleDetailChange('fromName', e.target.value)} />
                        <TextArea label="Your Address" id="fromAddress" value={details.fromAddress} onChange={e => handleDetailChange('fromAddress', e.target.value)} rows={2} />
                        <Input label="Business Registration Number" id="fromBusinessNumber" value={details.fromBusinessNumber || ''} onChange={e => handleDetailChange('fromBusinessNumber', e.target.value)} placeholder="e.g. 2023/123456/07" />
                    </fieldset>
                    
                    {/* TO SECTION */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 w-full">To</legend>
                        <div>
                            <label htmlFor="client-select" className="block text-sm font-medium text-gray-700">Select Client</label>
                            <select
                                id="client-select"
                                onChange={handleClientSelect}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">-- Manual Entry or Select a Client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input label="Client Name / Company" id="toName" value={details.toName} onChange={e => handleDetailChange('toName', e.target.value)} placeholder="Client Co." />
                        <TextArea label="Client Address" id="toAddress" value={details.toAddress} onChange={e => handleDetailChange('toAddress', e.target.value)} rows={2} placeholder="456 Client Ave, Cape Town, 8000" />
                        <Input label="Client VAT Number (Optional)" id="toVatNumber" value={details.toVatNumber || ''} onChange={e => handleDetailChange('toVatNumber', e.target.value)} placeholder="e.g. 4000123456" />
                    </fieldset>

                    {/* SETTINGS SECTION */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 w-full">Invoice Settings</legend>
                        <TextArea label="Header (Optional)" id="header" value={details.header || ''} onChange={e => handleDetailChange('header', e.target.value)} rows={1} placeholder="e.g., INVOICE or TAX INVOICE" />
                        <div className="grid grid-cols-2 gap-4">
                             <Input label="Invoice Number" id="invoiceNumber" value={details.invoiceNumber} onChange={e => handleDetailChange('invoiceNumber', e.target.value)} />
                             <Input label="Date" id="date" type="date" value={details.date} onChange={e => handleDetailChange('date', e.target.value)} />
                        </div>
                        <Input label="Payment Terms (Optional)" id="paymentTerms" value={details.paymentTerms || ''} onChange={e => handleDetailChange('paymentTerms', e.target.value)} placeholder="e.g., Net 30, Due upon receipt" />
                    </fieldset>

                    {/* ITEMS SECTION */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 w-full mb-4">Items</legend>
                        <div className="space-y-3">
                            {details.items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-2 rounded-md bg-slate-50 border border-slate-200">
                                    <div className="col-span-12 sm:col-span-5"><Input label={`Item ${index + 1}`} id={`desc-${item.id}`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Service or Product"/></div>
                                    <div className="col-span-4 sm:col-span-2"><Input label="Qty" id={`qty-${item.id}`} type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} /></div>
                                    <div className="col-span-8 sm:col-span-3"><Input label="Price (R)" id={`price-${item.id}`} type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} /></div>
                                    <div className="col-span-12 sm:col-span-2 flex justify-end">
                                        <Button variant="danger" onClick={() => removeItem(item.id)} className="w-full sm:w-auto !py-2 !px-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={addItem} className="mt-3">Add Item</Button>
                    </fieldset>
                    
                     <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 w-full">Notes & Footer</legend>
                        <TextArea label="Notes" id="notes" value={details.notes} onChange={e => handleDetailChange('notes', e.target.value)} rows={2} />
                        <TextArea label="Footer (Optional)" id="footer" value={details.footer || ''} onChange={e => handleDetailChange('footer', e.target.value)} rows={2} placeholder="e.g., Thank you for your business!"/>
                    </fieldset>

                    <div className="pt-4">
                        <Button onClick={handleSubmit} isLoading={loading} className="w-full">Generate Invoice</Button>
                    </div>
                </div>
            </Card>

            <Card title="Invoice Preview" className="lg:sticky lg:top-8">
                {loading && <div className="text-center p-8">Generating your professional invoice...</div>}
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
                {generatedHtml && (
                    <div>
                         <div className="flex justify-end gap-2 mb-4">
                            <Button variant="secondary" onClick={() => window.print()}>Print</Button>
                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(generatedHtml)}>Copy HTML</Button>
                        </div>
                        <div className="border rounded-md p-4 bg-white" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                    </div>
                )}
                 {!loading && !generatedHtml && <div className="text-center p-16 text-slate-500 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p>Your generated invoice will appear here.</p>
                 </div>}
            </Card>
        </div>
    );
};

export default InvoiceGenerator;