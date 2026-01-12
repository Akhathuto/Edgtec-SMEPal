import React, { useState, useEffect } from 'react';
import type { Client } from '../types';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Client | Omit<Client, 'id'>) => void;
    clientToEdit: Client | null;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, clientToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactPerson: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (clientToEdit) {
            setFormData({
                name: clientToEdit.name,
                address: clientToEdit.address,
                contactPerson: clientToEdit.contactPerson || '',
                email: clientToEdit.email || '',
                phone: clientToEdit.phone || '',
            });
        } else {
            setFormData({ name: '', address: '', contactPerson: '', email: '', phone: '' });
        }
    }, [clientToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.address) {
            if (clientToEdit) {
                onSave({ ...clientToEdit, ...formData });
            } else {
                onSave(formData);
            }
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-indigo-600/10 backdrop-blur-md z-[60] flex justify-center items-center p-4 animate-fade-in" onMouseDown={onClose}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg animate-scale-in border border-white/50" onMouseDown={e => e.stopPropagation()}>
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{clientToEdit ? 'Edit Relationship' : 'Onboard Partner'}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Directory Update Terminal</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input id="name" label="Legal Entity / Full Name" value={formData.name} onChange={handleChange} required />
                    <TextArea id="address" label="Official Address" value={formData.address} onChange={handleChange} required rows={3} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <Input id="contactPerson" label="Liaison Name" value={formData.contactPerson} onChange={handleChange} />
                         <Input id="email" label="Contact Email" type="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <Input id="phone" label="Secure Contact Line" value={formData.phone} onChange={handleChange} />
                    <div className="flex justify-end gap-3 pt-6">
                        <Button type="button" variant="ghost" onClick={onClose} className="!rounded-xl px-6">Cancel</Button>
                        <Button type="submit" className="!rounded-xl px-8 shadow-xl shadow-indigo-100">Synchronize Data</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientFormModal;