import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../contexts/ExpenseContext.jsx';
import Loading from '../Loading';
import { FiTrendingUp, FiDollarSign, FiActivity, FiArrowDown, FiPieChart, FiBarChart2, FiCalendar, FiDownload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const Reports = () => {
    const { expenses, loading } = useExpenses();
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) {
        return <Loading message="Loading financial reports..." />;
    }

    // Advanced analytics calculations
    const analytics = useMemo(() => {
        const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
        const totalExpense = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
        const totalTransactions = expenses.length;
        const avgTransaction = totalTransactions > 0 ? Math.round((totalIncome + totalExpense) / totalTransactions) : 0;

        // Monthly trends
        const monthlyData = {};
        expenses.forEach(expense => {
            const month = new Date(expense.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { month, income: 0, expense: 0 };
            }
            if (expense.type === 'income') {
                monthlyData[month].income += expense.amount;
            } else {
                monthlyData[month].expense += expense.amount;
            }
        });
        const monthlyTrends = Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month));

        // Category breakdown
        const categoryData = {};
        expenses.filter(e => e.type === 'expense').forEach(expense => {
            categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
        });
        const categoryBreakdown = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

        // Top categories
        const topCategories = categoryBreakdown.sort((a, b) => b.value - a.value).slice(0, 5);

        // Daily averages
        const dailyAvgIncome = totalIncome / 30; // Assuming 30 days
        const dailyAvgExpense = totalExpense / 30;

        return {
            totalIncome,
            totalExpense,
            totalTransactions,
            avgTransaction,
            monthlyTrends,
            categoryBreakdown,
            topCategories,
            dailyAvgIncome,
            dailyAvgExpense,
            savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0
        };
    }, [expenses]);

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiActivity },
        { id: 'trends', label: 'Trends', icon: FiBarChart2 },
        { id: 'categories', label: 'Categories', icon: FiPieChart },
        { id: 'insights', label: 'Insights', icon: FiTrendingUp }
    ];

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Reports</h1>
                    <p className="text-gray-600 mt-1">Comprehensive analysis of your financial data</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <FiDownload className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                <div className="flex flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                activeTab === tab.id
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Transactions</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalTransactions}</p>
                                </div>
                                <FiActivity className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Income</p>
                                    <p className="text-2xl font-bold text-green-600">₹{analytics.totalIncome.toLocaleString('en-IN')}</p>
                                </div>
                                <FiTrendingUp className="w-8 h-8 text-green-500" />
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Expense</p>
                                    <p className="text-2xl font-bold text-red-600">₹{analytics.totalExpense.toLocaleString('en-IN')}</p>
                                </div>
                                <FiArrowDown className="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Savings Rate</p>
                                    <p className={`text-2xl font-bold ${analytics.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {analytics.savingsRate.toFixed(1)}%
                                    </p>
                                </div>
                                <FiDollarSign className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Net Savings</p>
                                    <p className={`text-2xl font-bold ${analytics.totalIncome - analytics.totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ₹{(analytics.totalIncome - analytics.totalExpense).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Avg Transaction</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{analytics.avgTransaction.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Averages</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Daily Income</p>
                                    <p className="text-2xl font-bold text-green-600">₹{Math.round(analytics.dailyAvgIncome).toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Daily Expense</p>
                                    <p className="text-2xl font-bold text-red-600">₹{Math.round(analytics.dailyAvgExpense).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'trends' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income vs Expense</h3>
                        {analytics.monthlyTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={analytics.monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                    <Tooltip 
                                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, value === analytics.monthlyTrends[0]?.income ? 'Income' : 'Expense']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Bar dataKey="income" fill="#22c55e" name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No data available for trends analysis</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense by Category</h3>
                            {analytics.categoryBreakdown.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={analytics.categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {analytics.categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No expense data available</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                            <div className="space-y-4">
                                {analytics.topCategories.map((category, index) => (
                                    <div key={category.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            ></div>
                                            <span className="font-medium text-gray-900">{category.name}</span>
                                        </div>
                                        <span className="font-bold text-red-600">
                                            ₹{category.value.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                                {analytics.topCategories.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No categories to display</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <span className="text-green-800 font-medium">Income Frequency</span>
                                    <span className="text-green-600 font-bold">
                                        {expenses.filter(e => e.type === 'income').length} transactions
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                    <span className="text-red-800 font-medium">Expense Frequency</span>
                                    <span className="text-red-600 font-bold">
                                        {expenses.filter(e => e.type === 'expense').length} transactions
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                    <span className="text-purple-800 font-medium">Savings Rate</span>
                                    <span className={`font-bold ${analytics.savingsRate >= 20 ? 'text-green-600' : analytics.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {analytics.savingsRate.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                            <div className="space-y-3">
                                {analytics.savingsRate < 10 && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-800 text-sm">
                                            💡 Consider reducing expenses to improve your savings rate
                                        </p>
                                    </div>
                                )}
                                {analytics.savingsRate >= 20 && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-800 text-sm">
                                            🎉 Great job! You're maintaining a healthy savings rate
                                        </p>
                                    </div>
                                )}
                                {analytics.totalTransactions < 5 && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-blue-800 text-sm">
                                            📊 Add more transactions to get better insights
                                        </p>
                                    </div>
                                )}
                                {analytics.topCategories.length > 0 && analytics.topCategories[0].value > analytics.totalExpense * 0.5 && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ High spending in {analytics.topCategories[0].name} - consider budgeting
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity - shown on all tabs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {expenses.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No transactions yet. Add your first transaction to see reports!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {expenses.slice(0, 5).map((expense, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">{expense.category}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(expense.created_at).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN')}
                                    </p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        expense.type === 'income' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {expense.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
