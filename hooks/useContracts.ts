import { useState, useEffect, useCallback } from 'react';
import type { GeneratedContract } from '../types';
import { db, auth, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export interface SavedContract extends GeneratedContract {
    id: string;
    description: string;
    createdAt: string;
}

export const useContracts = () => {
    const [contracts, setContracts] = useState<SavedContract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setContracts([]);
            setIsLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;
        const contractsRef = collection(db, 'users', userId, 'contracts');
        const q = query(contractsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const contractsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedContract[];
            setContracts(contractsData);
            setIsLoading(false);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${userId}/contracts`);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const saveContract = useCallback(async (contract: Omit<SavedContract, 'id'>) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const contractsRef = collection(db, 'users', userId, 'contracts');
        const newContractRef = doc(contractsRef);
        
        try {
            await setDoc(newContractRef, {
                ...contract,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${userId}/contracts/${newContractRef.id}`);
        }
    }, []);

    const deleteContract = useCallback(async (contractId: string) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const contractRef = doc(db, 'users', userId, 'contracts', contractId);
        
        try {
            await deleteDoc(contractRef);
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${userId}/contracts/${contractId}`);
        }
    }, []);

    return { contracts, saveContract, deleteContract, isLoading };
};
