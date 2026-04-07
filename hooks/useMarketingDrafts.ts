import { useState, useEffect, useCallback } from 'react';
import type { MarketingContent } from '../types';
import { db, auth, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export interface SavedDraft extends MarketingContent {
    id: string;
    topic: string;
    createdAt: string;
}

export const useMarketingDrafts = () => {
    const [drafts, setDrafts] = useState<SavedDraft[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setDrafts([]);
            setIsLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;
        const draftsRef = collection(db, 'users', userId, 'marketingDrafts');
        const q = query(draftsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const draftsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedDraft[];
            setDrafts(draftsData);
            setIsLoading(false);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${userId}/marketingDrafts`);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const saveDraft = useCallback(async (draft: Omit<SavedDraft, 'id'>) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const draftsRef = collection(db, 'users', userId, 'marketingDrafts');
        const newDraftRef = doc(draftsRef);
        
        try {
            await setDoc(newDraftRef, {
                ...draft,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${userId}/marketingDrafts/${newDraftRef.id}`);
        }
    }, []);

    const deleteDraft = useCallback(async (draftId: string) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const draftRef = doc(db, 'users', userId, 'marketingDrafts', draftId);
        
        try {
            await deleteDoc(draftRef);
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${userId}/marketingDrafts/${draftId}`);
        }
    }, []);

    return { drafts, saveDraft, deleteDraft, isLoading };
};
