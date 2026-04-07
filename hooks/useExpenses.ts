import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '../types';
import { db, auth, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setExpenses([]);
            setIsLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;
        const expensesRef = collection(db, 'users', userId, 'expenses');
        const q = query(expensesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expensesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Expense[];
            setExpenses(expensesData);
            setIsLoading(false);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${userId}/expenses`);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const expensesRef = collection(db, 'users', userId, 'expenses');
        const newExpenseRef = doc(expensesRef);
        
        try {
            await setDoc(newExpenseRef, {
                ...expense,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${userId}/expenses/${newExpenseRef.id}`);
        }
    }, []);

    const deleteExpense = useCallback(async (expenseId: string) => {
        if (!auth.currentUser) return;
        const userId = auth.currentUser.uid;
        const expenseRef = doc(db, 'users', userId, 'expenses', expenseId);
        
        try {
            await deleteDoc(expenseRef);
        } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${userId}/expenses/${expenseId}`);
        }
    }, []);

    return { expenses, addExpense, deleteExpense, isLoading };
};
