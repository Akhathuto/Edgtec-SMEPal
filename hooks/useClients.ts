
import { useState, useEffect, useCallback } from 'react';
import type { Client } from '../types';
import { db, auth, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setClients([]);
            setIsLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;
        const clientsRef = collection(db, 'users', userId, 'clients');
        const q = query(clientsRef, orderBy('name', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const clientsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Client[];
            setClients(clientsData);
            setIsLoading(false);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${userId}/clients`);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addClient = useCallback(async (client: Omit<Client, 'id'>) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const clientsRef = collection(db, 'users', userId, 'clients');
        const newClientRef = doc(clientsRef);
        
        try {
            await setDoc(newClientRef, {
                ...client,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${userId}/clients/${newClientRef.id}`);
        }
    }, []);

    const updateClient = useCallback(async (updatedClient: Client) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const clientRef = doc(db, 'users', userId, 'clients', updatedClient.id);
        
        try {
            const { id, ...data } = updatedClient;
            await updateDoc(clientRef, data);
        } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/clients/${updatedClient.id}`);
        }
    }, []);

    const deleteClient = useCallback(async (clientId: string) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const clientRef = doc(db, 'users', userId, 'clients', clientId);
        
        try {
            await deleteDoc(clientRef);
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${userId}/clients/${clientId}`);
        }
    }, []);

    const deleteClients = useCallback(async (clientIds: string[]) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        
        // Batch delete would be better, but for simplicity we'll do individual deletes
        // In a real app, use writeBatch
        for (const id of clientIds) {
            try {
                await deleteDoc(doc(db, 'users', userId, 'clients', id));
            } catch (error) {
                handleFirestoreError(error, OperationType.DELETE, `users/${userId}/clients/${id}`);
            }
        }
    }, []);

    return { clients, addClient, updateClient, deleteClient, deleteClients, isLoading };
};
