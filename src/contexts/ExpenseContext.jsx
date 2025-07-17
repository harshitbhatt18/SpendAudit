import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => {
    return useContext(ExpenseContext);
};

export const ExpenseProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    const getExpenses = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setExpenses(data || []);
        } catch (error) {
            console.error('Error fetching expenses:', error.message);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        getExpenses();
    }, [getExpenses]);

    useEffect(() => {
        const income = expenses
            .filter(e => e.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const expense = expenses
            .filter(e => e.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
        setTotalIncome(income);
        setTotalExpense(expense);
    }, [expenses]);

    const addExpense = async (expenseData) => {
        if (!currentUser) return;
        try {
            const { data, error } = await supabase
                .from('expenses')
                .insert([{ ...expenseData, user_id: currentUser.id }])
                .select();

            if (error) {
                throw error;
            }

            if (data) {
                setExpenses(prev => [data[0], ...prev]);
            }
            return data;
        } catch (error) {
            console.error('Error adding expense:', error.message);
        }
    };

    const value = {
        expenses,
        addExpense,
        loading,
        totalIncome,
        totalExpense,
        totalSavings: totalIncome - totalExpense,
        getExpenses,
    };

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
};
