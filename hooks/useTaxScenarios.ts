import { useState, useEffect, useCallback } from 'react';
import type { TaxCalculationResult } from '../types';
import { db, auth, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export interface SavedTaxScenario {
    id: string;
    name: string;
    income: number;
    expenses: number;
    deductions: number;
    credits: number;
    result: TaxCalculationResult;
    createdAt: string;
}

export const useTaxScenarios = () => {
    const [scenarios, setScenarios] = useState<SavedTaxScenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setScenarios([]);
            setIsLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;
        const scenariosRef = collection(db, 'users', userId, 'taxScenarios');
        const q = query(scenariosRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const scenariosData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedTaxScenario[];
            setScenarios(scenariosData);
            setIsLoading(false);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${userId}/taxScenarios`);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const saveScenario = useCallback(async (scenario: Omit<SavedTaxScenario, 'id'>) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const scenariosRef = collection(db, 'users', userId, 'taxScenarios');
        const newScenarioRef = doc(scenariosRef);
        
        try {
            await setDoc(newScenarioRef, {
                ...scenario,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${userId}/taxScenarios/${newScenarioRef.id}`);
        }
    }, []);

    const deleteScenario = useCallback(async (scenarioId: string) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const scenarioRef = doc(db, 'users', userId, 'taxScenarios', scenarioId);
        
        try {
            await deleteDoc(scenarioRef);
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${userId}/taxScenarios/${scenarioId}`);
        }
    }, []);

    return { scenarios, saveScenario, deleteScenario, isLoading };
};
