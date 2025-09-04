import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { generateInvoiceHtml } from '../services/geminiService';
import type { InvoiceDetails, InvoiceItem } from '../types';
import { useClients } from '../hooks/useClients';

// Define types for window-injected libraries for TypeScript
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

const LAST_INVOICE_NUMBER_KEY = 'sme-pal-last-invoice-number';
const DEFAULT_INVOICE_NUMBER = 'INV-001';

const getNextInvoiceNumber = (currentNumber: string): string => {
    const numberMatch = currentNumber.match(/\d+$/);

    if (!numberMatch) {
        return `${currentNumber}-1`;
    }

    const numStr = numberMatch[0];
    const prefix = currentNumber.substring(0, currentNumber.length - numStr.length);
    const num = parseInt(numStr, 10) + 1;
    const padding = numStr.length;

    return `${prefix}${String(num).padStart(padding, '0')}`;
};


const InvoiceGenerator: React.FC = () => {
    const [details, setDetails] = useState<InvoiceDetails>({
        fromName: 'Your Company Name',
        fromAddress: '123 Business Rd, Johannesburg, 2000',
        fromBusinessNumber: '',
        fromVatNumber: '',
        toName: '',
        toAddress: '',
        toBusinessNumber: '',
        toVatNumber: '',
        invoiceNumber: DEFAULT_INVOICE_NUMBER,
        date: new Date().toISOString().split('T')[0],
        paymentTerms: 'Due upon receipt',
        paymentLink: '',
        items: [{ id: 1, description: 'Website Development', quantity: 1, unitPrice: 15000 }],
        notes: 'Payment is due within 30 days.',
        header: 'INVOICE',
        footer: 'Thank you for your business!',
        companyLogo: '',
    });
    const [loading, setLoading] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isAutoIncrement, setIsAutoIncrement] = useState(true);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [error, setError] = useState('');
    const { clients } = useClients();

    // Effect for initializing and updating the invoice number when auto-increment is toggled
    useEffect(() => {
        if (isAutoIncrement) {
            const lastUsedNumber = localStorage.getItem(LAST_INVOICE_NUMBER_KEY);
            const nextNumber = lastUsedNumber ? getNextInvoiceNumber(lastUsedNumber) : DEFAULT_INVOICE_NUMBER;
            setDetails(prev => ({ ...prev, invoiceNumber: nextNumber }));
        }
    }, [isAutoIncrement]);

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
                toBusinessNumber: '',
                toVatNumber: '',
            }));
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file (PNG, JPG).');
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

            if (isAutoIncrement) {
                const usedNumber = details.invoiceNumber;
                localStorage.setItem(LAST_INVOICE_NUMBER_KEY, usedNumber);
                const nextNumber = getNextInvoiceNumber(usedNumber);
                // Update the form for the next invoice
                setDetails(prev => ({ ...prev, invoiceNumber: nextNumber }));
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = async () => {
        if (!generatedHtml) return;
    
        setIsExportingPdf(true);
        setError('');
        try {
            const invoiceElement = document.getElementById('invoice-preview-content');
            if (!invoiceElement) {
                setError('Could not find invoice element to export.');
                setIsExportingPdf(false);
                return;
            }
    
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
    
            const canvas = await window.html2canvas(invoiceElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                width: invoiceElement.scrollWidth,
                windowWidth: invoiceElement.scrollWidth
            });
    
            const imgData = canvas.toDataURL('image/png');
            const margin = 15; // 15mm page margin
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
    
            const usableWidth = pdfWidth - margin * 2;
    
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const aspectRatio = canvasWidth / canvasHeight;
            
            const scaledHeight = usableWidth / aspectRatio;
    
            let heightLeft = scaledHeight;
            let position = 0;
            const usablePageHeight = pdfHeight - margin * 2;
    
            pdf.addImage(imgData, 'PNG', margin, margin, usableWidth, scaledHeight);
            heightLeft -= usablePageHeight;
    
            while (heightLeft > 0) {
                position -= usablePageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position + margin, usableWidth, scaledHeight);
                heightLeft -= usablePageHeight;
            }
    
            pdf.save(`invoice-${details.invoiceNumber || 'download'}.pdf`);
    
        } catch (err) {
            console.error("Error exporting to PDF:", err);
            setError('Failed to export invoice to PDF. Please try again.');
        } finally {
            setIsExportingPdf(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Invoice Details" className="h-fit">
                <div className="space-y-6">
                    {/* FROM/TO SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 w-full">From</legend>
                            <Input label="Your Name / Company" id="fromName" value={details.fromName} onChange={e => handleDetailChange('fromName', e.target.value)} />
                            <TextArea label="Your Address" id="fromAddress" value={details.fromAddress} onChange={e => handleDetailChange('fromAddress', e.target.value)} rows={2} />
                            <Input label="Company Registration Number" id="fromBusinessNumber" value={details.fromBusinessNumber || ''} onChange={e => handleDetailChange('fromBusinessNumber', e.target.value)} placeholder="e.g. 2023/123456/07" />
                            <Input label="VAT Number (Optional)" id="fromVatNumber" value={details.fromVatNumber || ''} onChange={e => handleDetailChange('fromVatNumber', e.target.value)} placeholder="e.g. 4000123456" />
                        </fieldset>
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 w-full">To</legend>
                            <div>
                                <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                                <select id="client-select" onChange={handleClientSelect} className="form-input">
                                    <option value="">-- Manual Entry or Select a Client --</option>
                                    {clients.map(client => (<option key={client.id} value={client.id}>{client.name}</option>))}
                                </select>
                            </div>
                            <Input label="Client Name / Company" id="toName" value={details.toName} onChange={e => handleDetailChange('toName', e.target.value)} placeholder="Client Co." />
                            <TextArea label="Client Address" id="toAddress" value={details.toAddress} onChange={e => handleDetailChange('toAddress', e.target.value)} rows={2} placeholder="456 Client Ave, Cape Town, 8000" />
                            <Input label="Client Company Reg / Tax No. (Optional)" id="toBusinessNumber" value={details.toBusinessNumber || ''} onChange={e => handleDetailChange('toBusinessNumber', e.target.value)} placeholder="e.g. 2023/123456/07" />
                            <Input label="Client VAT Number (Optional)" id="toVatNumber" value={details.toVatNumber || ''} onChange={e => handleDetailChange('toVatNumber', e.target.value)} placeholder="e.g. 4000123456" />
                        </fieldset>
                    </div>

                    {/* SETTINGS SECTION */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 w-full">Invoice Settings</legend>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <Input 
                                    label="Invoice Number" 
                                    id="invoiceNumber" 
                                    value={details.invoiceNumber} 
                                    onChange={e => handleDetailChange('invoiceNumber', e.target.value)}
                                    readOnly={isAutoIncrement}
                                    className={isAutoIncrement ? 'bg-slate-100 cursor-not-allowed' : ''}
                                />
                                <div className="mt-2 flex items-center">
                                    <input
                                        id="auto-increment"
                                        type="checkbox"
                                        checked={isAutoIncrement}
                                        onChange={e => setIsAutoIncrement(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="auto-increment" className="ml-2 block text-sm text-gray-700">
                                        Auto-increment
                                    </label>
                                </div>
                            </div>
                             <Input label="Date" id="date" type="date" value={details.date} onChange={e => handleDetailChange('date', e.target.value)} />
                        </div>
                        <Input label="Payment Terms (Optional)" id="paymentTerms" value={details.paymentTerms || ''} onChange={e => handleDetailChange('paymentTerms', e.target.value)} placeholder="e.g., Net 30, Due upon receipt" />
                        <Input label="Online Payment Link (Optional)" id="paymentLink" value={details.paymentLink || ''} onChange={e => handleDetailChange('paymentLink', e.target.value)} placeholder="e.g., https://pay.your-provider.com/..." />
                    </fieldset>

                    {/* BRANDING & CUSTOMIZATION SECTION */}
                    <fieldset className="space-y-4 pt-4 border-t border-slate-200">
                        <legend className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 w-full">Branding & Customization</legend>
                        <div>
                            <label htmlFor="companyLogoUpload" className="block text-sm font-medium text-gray-700 mb-1">Company Logo (Optional)</label>
                             <div className="mt-1 flex items-center gap-4">
                                {details.companyLogo ? (
                                    <div className="flex items-center gap-2">
                                        <img src={details.companyLogo} alt="Company Logo Preview" className="h-16 w-16 object-contain border p-1 rounded-md bg-white" />
                                        <Button variant="danger" onClick={removeLogo} className="!py-1 !px-2">Remove</Button>
                                    </div>
                                ) : (
                                    <input id="companyLogoUpload" type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                                )}
                            </div>
                            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                        </div>
                        <Input label="Header Title" id="header" value={details.header || ''} onChange={e => handleDetailChange('header', e.target.value)} placeholder="e.g., INVOICE or TAX INVOICE" />
                        <TextArea label="Footer Text (Optional)" id="footer" value={details.footer || ''} onChange={e => handleDetailChange('footer', e.target.value)} rows={2} placeholder="e.g., Thank you for your business!"/>
                    </fieldset>

                    {/* ITEMS SECTION */}
                    <fieldset>
                        <legend className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 w-full mb-4">Items</legend>
                        <div className="space-y-3">
                            {details.items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-2 rounded-md bg-slate-50 border border-slate-200">
                                    <div className="col-span-12 sm:col-span-5"><Input label={`Item ${index + 1}`} id={`desc-${item.id}`} value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Service or Product"/></div>
                                    <div className="col-span-4 sm:col-span-2"><Input label="Qty" id={`qty-${item.id}`} type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} /></div>
                                    <div className="col-span-8 sm:col-span-3"><Input label="Price (R)" id={`price-${item.id}`} type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} /></div>
                                    <div className="col-span-12 sm:col-span-2 flex justify-end">
                                        <button onClick={() => removeItem(item.id)} className="w-full sm:w-auto inline-flex items-center justify-center !py-2 !px-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={addItem} className="mt-3">Add Item</Button>
                    </fieldset>
                    
                     <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 w-full">Notes</legend>
                        <TextArea label="Additional Notes" id="notes" value={details.notes} onChange={e => handleDetailChange('notes', e.target.value)} rows={2} />
                    </fieldset>

                    <div className="pt-4">
                        <Button onClick={handleSubmit} isLoading={loading} className="w-full">Generate Invoice</Button>
                    </div>
                </div>
            </Card>

            <Card title="Invoice Preview" className="lg:sticky lg:top-8">
                {loading && (
                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                        <Spinner />
                        <p className="mt-4 text-slate-600">Generating your professional invoice...</p>
                    </div>
                )}
                {error && !loading && <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>}
                {generatedHtml && (
                    <div>
                         <div className="flex flex-wrap justify-end gap-2 mb-4">
                            <Button variant="secondary" onClick={handleExportPdf} isLoading={isExportingPdf}>Export PDF</Button>
                            <Button variant="secondary" onClick={handlePrint}>Print</Button>
                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(generatedHtml)}>Copy HTML</Button>
                        </div>
                        <div id="invoice-preview-content" className="border rounded-md p-4 bg-white shadow-inner" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                    </div>
                )}
                 {!loading && !generatedHtml && (
                    <div className="text-center p-16 text-slate-500 flex flex-col items-center justify-center min-h-[400px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="font-semibold">Your generated invoice will appear here.</p>
                        <p className="text-sm">Fill out the details on the left and click "Generate".</p>
                    </div>
                 )}
            </Card>
        </div>
    );
};

export default InvoiceGenerator;