import React, { useState } from 'react';
import { useClients } from '../hooks/useClients';
import Card from './common/Card';
import Button from './common/Button';
import ClientFormModal from './ClientFormModal';
import type { Client } from '../types';

const ClientManager: React.FC = () => {
    const { clients, addClient, updateClient, deleteClient, isLoading } = useClients();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

    const handleOpenModal = (client: Client | null = null) => {
        setClientToEdit(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setClientToEdit(null);
    };

    const handleSaveClient = (clientData: Client | Omit<Client, 'id'>) => {
        if ('id' in clientData) {
            updateClient(clientData);
        } else {
            addClient(clientData);
        }
    };

    const handleDeleteClient = (clientId: string) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            deleteClient(clientId);
        }
    };

    const handleExportCSV = () => {
        if (clients.length === 0) {
            alert("No clients to export.");
            return;
        }

        const headers = ['id', 'name', 'address', 'contactPerson', 'email', 'phone'];
        
        const escapeCSV = (field: string | undefined | null): string => {
            if (field === null || field === undefined) {
                return '""';
            }
            const str = String(field);
            const result = '"' + str.replace(/"/g, '""') + '"';
            return result;
        };

        const csvRows = [
            headers.join(','),
            ...clients.map(client => 
                [
                    escapeCSV(client.id),
                    escapeCSV(client.name),
                    escapeCSV(client.address),
                    escapeCSV(client.contactPerson),
                    escapeCSV(client.email),
                    escapeCSV(client.phone)
                ].join(',')
            )
        ];

        const csvString = csvRows.join('\n');
        
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `sme-pal-clients-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Card>
                <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                    <h2 className="text-xl font-semibold text-gray-800">Client Management</h2>
                     <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleExportCSV}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </Button>
                        <Button onClick={() => handleOpenModal()}>Add New Client</Button>
                    </div>
                </div>

                {isLoading && <p>Loading clients...</p>}

                {!isLoading && clients.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No clients yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding a new client.</p>
                        <div className="mt-6">
                            <Button onClick={() => handleOpenModal()}>Add Client</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {clients.map(client => (
                            <div key={client.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border border-slate-200">
                                <div>
                                    <p className="font-semibold text-slate-800">{client.name}</p>
                                    <p className="text-sm text-slate-500">{client.email || client.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => handleOpenModal(client)} className="!py-1.5 !px-3">Edit</Button>
                                    <Button variant="secondary" onClick={() => handleDeleteClient(client.id)} className="!py-1.5 !px-3 text-red-600 hover:bg-red-100">Delete</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <ClientFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveClient}
                clientToEdit={clientToEdit}
            />
        </div>
    );
};

export default ClientManager;