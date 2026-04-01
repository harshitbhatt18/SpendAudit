import React, { useState } from 'react';
import { useExpenses } from '../contexts/ExpenseContext.jsx';

const AddExpenseModal = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [error, setError] = useState('');
    const { addExpense } = useExpenses();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !category) {
            return setError('Please fill in all fields');
        }
        try {
            await addExpense({ 
                amount: parseFloat(amount), 
                category, 
                type, 
                created_at: new Date().toISOString(),
            });
            setAmount('');
            setCategory('');
            setType('expense');
            setError('');
            onClose();
        } catch (err) {
            setError('Failed to add expense. Please try again.');
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" role="dialog" aria-modal="true" aria-label="Add Transaction" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Transaction</h2>
                {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select 
                            id="type" 
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input 
                            type="number" 
                            id="amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            placeholder="e.g., 50"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input 
                            type="text" 
                            id="category" 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            placeholder="e.g., Groceries, Salary"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-md shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300"
                        >
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
