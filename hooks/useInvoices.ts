import { useState, useEffect, useCallback } from 'react';
import type { InvoiceDetails } from '../types';
import { db, auth, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export const useInvoices = () => {
    const [invoices, setInvoices] = useState<InvoiceDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setInvoices([]);
            setIsLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;
        const invoicesRef = collection(db, 'users', userId, 'invoices');
        const q = query(invoicesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const invoicesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as InvoiceDetails[];
            setInvoices(invoicesData);
            setIsLoading(false);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${userId}/invoices`);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const saveInvoice = useCallback(async (invoice: InvoiceDetails) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        
        // Use invoiceNumber as the document ID if it exists, otherwise generate one
        const invoiceId = invoice.invoiceNumber || doc(collection(db, 'users', userId, 'invoices')).id;
        const invoiceRef = doc(db, 'users', userId, 'invoices', invoiceId);
        
        try {
            await setDoc(invoiceRef, {
                ...invoice,
                id: invoiceId,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${userId}/invoices/${invoiceId}`);
        }
    }, []);

    const deleteInvoice = useCallback(async (invoiceId: string) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const invoiceRef = doc(db, 'users', userId, 'invoices', invoiceId);
        
        try {
            await deleteDoc(invoiceRef);
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${userId}/invoices/${invoiceId}`);
        }
    }, []);

    return { invoices, saveInvoice, deleteInvoice, isLoading };
};
