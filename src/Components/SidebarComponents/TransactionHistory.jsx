import React, { useState } from 'react';
import { useExpenses } from '../../contexts/ExpenseContext.jsx';
import Loading from '../Loading';
import { FiFilter, FiSearch, FiArrowUpRight, FiArrowDownLeft, FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const TransactionHistory = () => {
    const { expenses, loading } = useExpenses();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    // Filter and search transactions
    const filteredTransactions = expenses.filter(expense => {
        const matchesSearch = expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || expense.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Sort transactions
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === 'amount') {
            return b.amount - a.amount;
        }
        return 0;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return <Loading message="Loading transaction history..." />;
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaction History</h1>
                    <p className="text-gray-600 mt-1">Track all your income and expenses</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4" />
                    <span>{expenses.length} transactions</span>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Filter by Type */}
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>

                        {/* Sort by */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Transaction Cards */}
            <div className="space-y-3">
                {sortedTransactions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-all duration-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    sortedTransactions.map((transaction, index) => (
                        <div
                            key={transaction.id || index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg hover:scale-[1.02] hover:border-red-200 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    transaction.type === 'income' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-red-100 text-red-600'
                                }`}>
                                    {transaction.type === 'income' ? (
                                        <FiArrowUpRight className="w-6 h-6" />
                                    ) : (
                                        <FiArrowDownLeft className="w-6 h-6" />
                                    )}
                                </div>

                                {/* Transaction Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {transaction.category}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span>{formatDate(transaction.created_at)}</span>
                                                <span>{formatTime(transaction.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg sm:text-xl font-bold ${
                                                transaction.type === 'income' 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                                            </span>
                                            {transaction.type === 'income' ? (
                                                <FiTrendingUp className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <FiTrendingDown className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="mt-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            transaction.type === 'income'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary Stats */}
            {expenses.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-red-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600">Income Count</p>
                            <p className="text-2xl font-bold text-green-600">
                                {expenses.filter(e => e.type === 'income').length}
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600">Expense Count</p>
                            <p className="text-2xl font-bold text-red-600">
                                {expenses.filter(e => e.type === 'expense').length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
