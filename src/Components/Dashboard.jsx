import React, { useState } from 'react';
import Loading from './Loading';
import { FiHome, FiTrendingUp, FiBox, FiDollarSign, FiSettings, FiHelpCircle, FiMenu, FiMoreHorizontal, FiArrowUp, FiArrowDown, FiLogOut, FiPlus, FiBook } from 'react-icons/fi';
import { MdOutlineInventory, MdOutlineAccountBalanceWallet, MdAssessment } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpenseContext.jsx';
import { useNavigate } from 'react-router-dom';
import AddExpenseModal from './AddExpenseModal';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { currentUser, signout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const navItems = [
        { icon: <FiHome />, name: 'Dashboard', path: '/dashboard' },
        { icon: <FiBox />, name: 'Transaction History', path: '/dashboard/transactions' },
        { icon: <MdAssessment />, name: 'Reports', path: '/dashboard/reports' },
        { icon: <FiBook />, name: 'Guides', path: '/dashboard/guides' },
    ];

    const bottomNavItems = [
        { icon: <FiSettings />, name: 'Settings', path: '/dashboard/settings' },
        { icon: <FiHelpCircle />, name: 'Help', path: '/dashboard/help' },
    ];

    const handleNavClick = (path) => {
        navigate(path);
        if (window.innerWidth < 640) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 left-0 h-full bg-white w-64 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 sm:w-64`}>
                <div className="p-4">
                    <h1 
                        className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        onClick={() => navigate('/dashboard')}
                    >
                        ExpenseTracker
                    </h1>
                </div>
                <nav className="mt-8 flex flex-col justify-between h-[calc(100%-120px)]">
                    <div>
                        <ul>
                            {navItems.map((item, index) => (
                                <li key={index} onClick={() => handleNavClick(item.path)} className="px-4 py-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 cursor-pointer flex items-center justify-between group">
                                    <div className="flex items-center">
                                        <span className="group-hover:text-red-500 transition-colors duration-200">{item.icon}</span>
                                        <span className="ml-3 group-hover:text-red-600 transition-colors duration-200">{item.name}</span>
                                    </div>
                                    {item.count && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.count}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <ul>
                            {bottomNavItems.map((item, index) => (
                                <li key={index} onClick={() => handleNavClick(item.path)} className="px-4 py-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 cursor-pointer flex items-center group">
                                    <div className="flex items-center">
                                        <span className="group-hover:text-red-500 transition-colors duration-200">{item.icon}</span>
                                        <span className="ml-3 group-hover:text-red-600 transition-colors duration-200">{item.name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="p-4 border-t border-gray-200 mt-4">
                            <div className="flex items-center mb-3">
                                <img 
                                    src={currentUser?.user_metadata?.avatar_url || "https://i.pravatar.cc/40?img=1"} 
                                    alt="User" 
                                    className="w-10 h-10 rounded-full object-cover" 
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="font-semibold truncate">{currentUser?.user_metadata?.name || 'User'}</p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {currentUser?.email ? 
                                            `${currentUser.email.substring(0, 2)}...${currentUser.email.split('@')[1] || 'gmail.com'}` 
                                            : 'user@email.com'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                            >
                                <FiLogOut className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

const StatCard = ({ title, amount, change, changeType, icon, bgColor, textColor }) => (
    <div className={`p-4 rounded-lg shadow-md ${bgColor} ${textColor} transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm">{title}</p>
                <p className="text-2xl font-bold">{amount}</p>
            </div>
            <FiMoreHorizontal />
        </div>
        <div className="mt-4 flex items-center text-sm">
            {changeType === 'up' ? <FiArrowUp className="text-green-500" /> : changeType === 'down' ? <FiArrowDown className="text-red-500" /> : null}
            <span className="ml-1">{change}</span>
        </div>
    </div>
);


const TopExpenseSourceChart = () => {
    const { expenses } = useExpenses();

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

    const expenseSources = expenses
        .filter(e => e.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) {
                existing.value += curr.amount;
            } else {
                acc.push({ name: curr.category, value: curr.amount });
            }
            return acc;
        }, []);

    const top5Expenses = expenseSources.sort((a, b) => b.value - a.value).slice(0, 5)
        .map((item, index) => ({
            ...item,
            fill: colors[index % colors.length]
        }));

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold mb-4 text-gray-800">Top 5 Expense Source</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top5Expenses} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Bar dataKey="value" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const RecentExpenses = () => {
    const { expenses } = useExpenses();
    const recentExpenses = expenses.slice(0, 4);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="font-bold mb-4">Recent Transactions</h2>
            <ul>
                {recentExpenses.map((expense, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                            <p className={`font-semibold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{expense.category}</p>
                            <p className="text-sm text-gray-500">{new Date(expense.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className={`font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN')}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ReportOverview = () => {
    const { totalIncome, totalExpense, totalSavings } = useExpenses();

    const data = [
        { name: 'Income', value: totalIncome, color: '#10B981' },
        { name: 'Expense', value: totalExpense, color: '#EF4444' },
        { name: 'Savings', value: totalSavings, color: '#3B82F6' },
    ].filter(item => item.value > 0); // Filter out items with 0 value

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold mb-4 text-gray-800">Report Overview</h2>
            <div className="sm:flex items-center">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        {data.length === 0 && <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#6b7280">No data available</text>}
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                    <ul>
                        {data.map((item, index) => (
                            <li key={index} className="flex items-center mb-2">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span>{item.name}</span>
                                <span className="ml-auto font-bold">₹{item.value.toLocaleString('en-IN')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ExpenseActivity = () => {
    const { expenses } = useExpenses();

    const expenseData = expenses
        .filter(e => e.type === 'expense')
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map(e => ({ name: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: e.amount }));

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold mb-4">Expense Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={expenseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" activeDot={{ r: 8 }} name="Expense" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

const DashboardHome = () => {
    const { totalIncome, totalExpense, totalSavings } = useExpenses();

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <StatCard title="TOTAL INCOME" amount={formatCurrency(totalIncome)} change={`${totalIncome > 0 ? '' : ''}`} changeType="" icon={<FiDollarSign />} bgColor="bg-white" textColor="text-gray-800" />
                <StatCard title="TOTAL EXPENSE" amount={formatCurrency(totalExpense)} change={`${totalExpense > 0 ? '' : ''}`} changeType="" icon={<FiDollarSign />} bgColor="bg-gradient-to-r from-red-400 to-red-600" textColor="text-white" />
                <StatCard title="TOTAL SAVINGS" amount={formatCurrency(totalSavings)} change={`${totalSavings > 0 ? '' : ''}`} changeType="" icon={<FiDollarSign />} bgColor="bg-white" textColor="text-gray-800" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <TopExpenseSourceChart />
                </div>
                <div className="hidden lg:block">
                    <RecentExpenses />
                </div>
            </div>
            
            <div className="block lg:hidden mt-4">
                <RecentExpenses />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <ReportOverview />
                <ExpenseActivity />
            </div>
        </>
    )
}

const Dashboard = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loading } = useExpenses();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading message="Loading dashboard..." size="lg" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b">
                    <button className="text-gray-500 focus:outline-none sm:hidden" onClick={() => setSidebarOpen(true)}>
                        <FiMenu size={24} />
                    </button>
                    <div className="flex items-center ml-auto">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all duration-300"
                        >
                            <FiPlus className="mr-2"/> Add Expense
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                    {children}
                </main>
            </div>
            <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export { Dashboard, DashboardHome };