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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onMouseDown={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onMouseDown={e => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">{clientToEdit ? 'Edit Client' : 'Add New Client'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input id="name" label="Client Name / Company" value={formData.name} onChange={handleChange} required />
                    <TextArea id="address" label="Address" value={formData.address} onChange={handleChange} required rows={3} />
                    <Input id="contactPerson" label="Contact Person (Optional)" value={formData.contactPerson} onChange={handleChange} />
                    <Input id="email" label="Email (Optional)" type="email" value={formData.email} onChange={handleChange} />
                    <Input id="phone" label="Phone (Optional)" value={formData.phone} onChange={handleChange} />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Client</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientFormModal;
