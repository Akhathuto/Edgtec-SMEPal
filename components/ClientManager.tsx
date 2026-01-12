
import React, { useState, useMemo } from 'react';
import { useClients } from '../hooks/useClients';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import ClientFormModal from './ClientFormModal';
import type { Client } from '../types';
import type { ToastType } from './common/Toast';

interface ClientManagerProps {
    showToast: (m: string, t: ToastType) => void;
}

const BusinessAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500'];
    const color = colors[name.length % colors.length];
    
    return (
        <div className={`h-12 w-12 rounded-[1.2rem] ${color} flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-100`}>
            {initials}
        </div>
    );
};

const ClientManager: React.FC<ClientManagerProps> = ({ showToast }) => {
    const { clients, addClient, updateClient, deleteClient, deleteClients, isLoading } = useClients();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Enhanced Search Logic
    const filteredClients = useMemo(() => {
        const term = search.toLowerCase();
        return clients.filter(c => 
            c.name.toLowerCase().includes(term) || 
            c.email?.toLowerCase().includes(term) ||
            c.contactPerson?.toLowerCase().includes(term) ||
            c.address.toLowerCase().includes(term) ||
            c.phone?.toLowerCase().includes(term)
        );
    }, [clients, search]);

    const handleOpenModal = (client: Client | null = null) => {
        setClientToEdit(client);
        setIsModalOpen(true);
    };

    const handleSaveClient = (clientData: Client | Omit<Client, 'id'>) => {
        try {
            if ('id' in clientData) {
                updateClient(clientData as Client);
                showToast("Client profile updated successfully.", "success");
            } else {
                addClient(clientData);
                showToast("New client added to your directory.", "success");
            }
        } catch (e) {
            showToast("Failed to save changes.", "error");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Archiving this client will remove them from the active directory. Proceed?")) {
            deleteClient(id);
            setSelectedIds(prev => prev.filter(sid => sid !== id));
            showToast("Client successfully archived.", "info");
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected clients?`)) {
            deleteClients(selectedIds);
            setSelectedIds([]);
            showToast(`${selectedIds.length} clients archived successfully.`, "success");
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredClients.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredClients.map(c => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const exportToCSV = (data: Client[]) => {
        const headers = ["Name", "Address", "Contact Person", "Email", "Phone"];
        const rows = data.map(c => [
            `"${c.name.replace(/"/g, '""')}"`,
            `"${c.address.replace(/"/g, '""')}"`,
            `"${(c.contactPerson || '').replace(/"/g, '""')}"`,
            `"${(c.email || '').replace(/"/g, '""')}"`,
            `"${(c.phone || '').replace(/"/g, '""')}"`
        ].join(','));
        
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `smepal_clients_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Directory exported to CSV.", "success");
    };

    const handleBulkExport = () => {
        const dataToExport = selectedIds.length > 0 
            ? clients.filter(c => selectedIds.includes(c.id))
            : filteredClients;
        exportToCSV(dataToExport);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Business Directory</h1>
                    <p className="text-slate-500 font-medium italic">Manage your {clients.length} active partnerships.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                         <input 
                            type="text" 
                            placeholder="Search names, emails, addresses..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3 pl-12 text-sm font-medium shadow-sm focus:ring-8 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none"
                        />
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => exportToCSV(clients)} className="!px-4">Export All</Button>
                        <Button onClick={() => handleOpenModal()} className="shadow-xl shadow-indigo-100">+ New Client</Button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-indigo-600 rounded-2xl p-4 flex items-center justify-between animate-soft-reveal shadow-lg">
                    <div className="flex items-center gap-4 text-white">
                        <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-xs">
                            {selectedIds.length}
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">Entities Selected</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleBulkExport} className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 !py-2">Bulk Export</Button>
                        <Button variant="danger" onClick={handleBulkDelete} className="!bg-rose-500 hover:!bg-rose-600 !py-2">Bulk Delete</Button>
                        <Button variant="ghost" onClick={() => setSelectedIds([])} className="!text-white hover:!bg-white/5 !py-2">Cancel</Button>
                    </div>
                </div>
            )}

            <Card className="rounded-[2.5rem] border-0 shadow-2xl p-0 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center flex flex-col items-center"><Spinner /><p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Directory...</p></div>
                ) : filteredClients.length === 0 ? (
                    <div className="p-32 text-center">
                         <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <svg className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                         </div>
                         <h3 className="text-xl font-black text-slate-900 tracking-tight">No entities found.</h3>
                         <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs mx-auto">Start building your database or adjust your search to find specific partners.</p>
                         <Button variant="secondary" onClick={() => handleOpenModal()} className="mt-8">Onboard First Client</Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-6 py-6 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                            checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-6">Partner Identity</th>
                                    <th className="px-6 py-6">Contact Info</th>
                                    <th className="px-6 py-6">Physical Presence</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(client.id) ? 'bg-indigo-50/40' : ''}`}>
                                        <td className="px-6 py-6">
                                             <input 
                                                type="checkbox" 
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                                checked={selectedIds.includes(client.id)}
                                                onChange={() => toggleSelect(client.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-5">
                                                <BusinessAvatar name={client.name} />
                                                <div>
                                                    <p className="text-base font-black text-slate-900 leading-none mb-1">{client.name}</p>
                                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{client.contactPerson || 'Direct Entity'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-bold text-slate-800">{client.email || 'N/A'}</p>
                                            <p className="text-xs font-medium text-slate-400">{client.phone || '-'}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-xs font-medium text-slate-500 line-clamp-1 max-w-[200px] italic">"{client.address}"</p>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleOpenModal(client)}
                                                    className="p-2.5 bg-white border border-slate-100 text-slate-600 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ClientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                clientToEdit={clientToEdit}
            />
        </div>
    );
};

export default ClientManager;
