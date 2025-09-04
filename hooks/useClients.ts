import { useState, useEffect, useCallback } from 'react';
import type { Client } from '../types';

const STORAGE_KEY = 'sme-pal-clients';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedClients = localStorage.getItem(STORAGE_KEY);
            if (storedClients) {
                setClients(JSON.parse(storedClients));
            }
        } catch (error) {
            console.error("Failed to load clients from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveClients = useCallback((updatedClients: Client[]) => {
        try {
            // Sort clients alphabetically by name before saving
            const sortedClients = updatedClients.sort((a, b) => a.name.localeCompare(b.name));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedClients));
            setClients(sortedClients);
        } catch (error) {
            console.error("Failed to save clients to localStorage", error);
        }
    }, []);

    const addClient = useCallback((client: Omit<Client, 'id'>) => {
        const newClient = { ...client, id: crypto.randomUUID() };
        const updatedClients = [...clients, newClient];
        saveClients(updatedClients);
    }, [clients, saveClients]);

    const updateClient = useCallback((updatedClient: Client) => {
        const updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
        saveClients(updatedClients);
    }, [clients, saveClients]);

    const deleteClient = useCallback((clientId: string) => {
        const updatedClients = clients.filter(c => c.id !== clientId);
        saveClients(updatedClients);
    }, [clients, saveClients]);

    return { clients, addClient, updateClient, deleteClient, isLoading };
};
