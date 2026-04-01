import React, { useState, useEffect } from 'react';
import { FiBook, FiClock, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiInfo, FiPlus, FiBarChart2, FiSettings, FiShield, FiDownload, FiFilter, FiSearch, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../contexts/supabaseClient';

const Guides = () => {
    const { currentUser } = useAuth();
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [completedGuides, setCompletedGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load guide progress from localStorage and Supabase
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const localProgress = localStorage.getItem('expensetracker_guide_progress');
                if (localProgress) {
                    const parsed = JSON.parse(localProgress);
                    setCompletedGuides(parsed);
                }

                if (currentUser) {
                    const { data, error } = await supabase
                        .from('user_preferences')
                        .select('guide_progress')
                        .eq('user_id', currentUser.id)
                        .single();

                    if (data && data.guide_progress) {
                        const remoteProgress = data.guide_progress;
                        setCompletedGuides(remoteProgress);
                        localStorage.setItem('expensetracker_guide_progress', JSON.stringify(remoteProgress));
                    } else if (!error || error.code === 'PGRST116') {
                        await createUserPreferences();
                    } else {
                        console.error('Error loading from Supabase:', error);
                    }
                }
            } catch (error) {
                console.error('Error loading guide progress:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProgress();
    }, [currentUser]);

    // Create user preferences record if it doesn't exist
    const createUserPreferences = async () => {
        if (!currentUser) return;

        try {
            const { error } = await supabase
                .from('user_preferences')
                .insert({
                    user_id: currentUser.id,
                    guide_progress: []
                });

            if (error && error.code !== '23505') { // Ignore duplicate key error
                console.error('Error creating user preferences:', error);
            }
        } catch (error) {
            console.error('Error creating user preferences:', error);
        }
    };

    // Save progress to both localStorage and Supabase
    const saveProgress = async (newProgress) => {
        try {
            localStorage.setItem('expensetracker_guide_progress', JSON.stringify(newProgress));
            setCompletedGuides(newProgress);

            if (currentUser) {
                const { error } = await supabase
                    .from('user_preferences')
                    .upsert({
                        user_id: currentUser.id,
                        guide_progress: newProgress,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id'
                    });

                if (error) {
                    console.error('Error saving guide progress to Supabase:', error);
                }
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    // Clear all progress (useful for testing or reset)
    const clearProgress = async () => {
        if (window.confirm('Are you sure you want to reset all guide progress? This cannot be undone.')) {
            await saveProgress([]);
        }
    };

    const guides = [
        {
            id: 1,
            title: "Getting Started with ExpenseTracker",
            description: "A complete guide to setting up your account and adding your first transactions",
            duration: "5 min read",
            level: "Beginner",
            topics: ["Account Setup", "First Transaction", "Dashboard Overview"],
            content: {
                introduction: "Welcome to ExpenseTracker! This guide will help you get started with managing your finances effectively.",
                sections: [
                    {
                        title: "Setting Up Your Account",
                        content: [
                            "After signing up, you'll be taken to your dashboard where you can see an overview of your financial data.",
                            "Your profile information is displayed in the sidebar. You can update your profile picture and personal details in the Settings section.",
                            "The dashboard shows your total income, expenses, and savings at a glance."
                        ]
                    },
                    {
                        title: "Adding Your First Transaction",
                        content: [
                            "Click the 'Add Expense' button in the top-right corner of the dashboard.",
                            "Fill in the transaction details: amount, category, description, and date.",
                            "Select whether it's an income or expense transaction.",
                            "Choose from predefined categories or create your own custom categories.",
                            "Click 'Save' to add the transaction to your records."
                        ]
                    },
                    {
                        title: "Understanding the Dashboard",
                        content: [
                            "The main dashboard shows three key metrics: Total Income, Total Expense, and Total Savings.",
                            "The 'Top 5 Expense Sources' chart helps you identify where most of your money is going.",
                            "Recent transactions are displayed for quick reference.",
                            "The pie chart gives you a visual breakdown of your income vs expenses.",
                            "The expense activity line chart shows your spending trends over time."
                        ]
                    }
                ],
                tips: [
                    "Start by adding a few recent transactions to get familiar with the interface.",
                    "Use descriptive names for your transactions to make them easier to track.",
                    "Review your dashboard regularly to stay on top of your spending habits."
                ]
            }
        },
        {
            id: 2,
            title: "Understanding Your Financial Reports",
            description: "Learn how to interpret charts, analyze spending patterns, and make informed decisions",
            duration: "8 min read",
            level: "Intermediate",
            topics: ["Charts Analysis", "Spending Patterns", "Financial Insights"],
            content: {
                introduction: "ExpenseTracker provides powerful analytics to help you understand your financial patterns and make better decisions.",
                sections: [
                    {
                        title: "Reading Your Charts",
                        content: [
                            "The bar chart shows your top expense categories, helping you identify where you spend the most.",
                            "The pie chart breaks down your financial distribution between income, expenses, and savings.",
                            "Line charts track your spending trends over time, showing patterns and fluctuations.",
                            "All charts are interactive - hover over elements to see detailed information."
                        ]
                    },
                    {
                        title: "Analyzing Spending Patterns",
                        content: [
                            "Look for recurring high-expense categories that might need attention.",
                            "Compare your monthly spending to identify seasonal patterns or unusual spikes.",
                            "Use the date filters to analyze specific time periods.",
                            "Pay attention to the income vs. expense ratio to ensure you're staying within budget."
                        ]
                    },
                    {
                        title: "Making Financial Decisions",
                        content: [
                            "Use the data to set realistic budgets for each category.",
                            "Identify areas where you can cut back on spending.",
                            "Track your progress toward financial goals.",
                            "Export reports to share with financial advisors or for tax preparation."
                        ]
                    }
                ],
                tips: [
                    "Review your reports weekly to stay on track with your financial goals.",
                    "Look for trends rather than focusing on individual transactions.",
                    "Use the insights to adjust your spending habits proactively."
                ]
            }
        },
        {
            id: 3,
            title: "Advanced Features & Tips",
            description: "Maximize your expense tracking with advanced features and best practices",
            duration: "10 min read",
            level: "Advanced",
            topics: ["Categories Management", "Data Export", "Security Settings"],
            content: {
                introduction: "Take your expense tracking to the next level with these advanced features and optimization tips.",
                sections: [
                    {
                        title: "Categories Management",
                        content: [
                            "Create custom categories that match your lifestyle and spending habits.",
                            "Use subcategories for more detailed tracking (e.g., Food > Restaurants, Groceries).",
                            "Regularly review and consolidate similar categories to keep your data organized.",
                            "Consider using tags or keywords in descriptions for additional filtering options."
                        ]
                    },
                    {
                        title: "Data Export & Backup",
                        content: [
                            "Export your data regularly as a backup and for external analysis.",
                            "Use CSV exports for spreadsheet analysis or integration with other tools.",
                            "PDF reports are great for sharing with accountants or financial advisors.",
                            "Set up automated weekly or monthly export reminders."
                        ]
                    },
                    {
                        title: "Security Best Practices",
                        content: [
                            "Enable two-factor authentication for enhanced account security.",
                            "Use a strong, unique password for your ExpenseTracker account.",
                            "Regularly review your account activity and logout when using shared devices.",
                            "Keep your profile information up to date for account recovery purposes."
                        ]
                    },
                    {
                        title: "Optimization Tips",
                        content: [
                            "Use the search and filter features to quickly find specific transactions.",
                            "Set up regular review sessions to analyze your spending patterns.",
                            "Take advantage of the mobile-responsive design for on-the-go expense tracking.",
                            "Use the notification settings to get reminders about your financial goals."
                        ]
                    }
                ],
                tips: [
                    "Customize your dashboard layout to focus on the metrics most important to you.",
                    "Experiment with different time ranges to uncover hidden spending patterns.",
                    "Use the bulk import feature if you're migrating from another expense tracking tool."
                ]
            }
        },
        {
            id: 4,
            title: "Mobile Usage Guide",
            description: "Tips for using ExpenseTracker on mobile devices and responsive features",
            duration: "4 min read",
            level: "Beginner",
            topics: ["Mobile Interface", "Touch Gestures", "Offline Usage"],
            content: {
                introduction: "ExpenseTracker is designed to work seamlessly across all devices. Learn how to make the most of the mobile experience.",
                sections: [
                    {
                        title: "Mobile Interface Navigation",
                        content: [
                            "The sidebar automatically collapses on mobile devices to save screen space.",
                            "Tap the menu icon (☰) in the top-left corner to open the navigation sidebar.",
                            "The sidebar closes automatically after selecting a navigation item on mobile.",
                            "All charts and tables are optimized for touch interaction and smaller screens."
                        ]
                    },
                    {
                        title: "Touch Gestures & Interactions",
                        content: [
                            "Tap and hold on chart elements to see detailed information.",
                            "Swipe left or right on transaction lists to access quick actions.",
                            "Pinch to zoom on charts for better visibility of detailed data.",
                            "Use pull-to-refresh on data lists to update information."
                        ]
                    },
                    {
                        title: "Mobile-Specific Features",
                        content: [
                            "The mobile layout prioritizes the most important information first.",
                            "Forms are optimized for mobile keyboards with appropriate input types.",
                            "Large touch targets make navigation easy even on smaller screens.",
                            "The responsive design adapts to both portrait and landscape orientations."
                        ]
                    }
                ],
                tips: [
                    "Add ExpenseTracker to your home screen for quick access like a native app.",
                    "Use the mobile version for quick expense entry while you're out and about.",
                    "The interface works great on tablets for a larger mobile experience."
                ]
            }
        }
    ];

    const handleGuideClick = (guide) => {
        setSelectedGuide(guide);
    };

    const handleBackToList = () => {
        setSelectedGuide(null);
    };

    const markAsCompleted = async (guideId) => {
        if (!completedGuides.includes(guideId)) {
            const newProgress = [...completedGuides, guideId];
            await saveProgress(newProgress);
        }
    };

    if (loading) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your guides...</p>
                </div>
            </div>
        );
    }

    if (selectedGuide) {
        return (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center text-red-600 hover:text-red-700 mb-4 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Back to Guides
                    </button>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{selectedGuide.title}</h1>
                            <p className="text-gray-600 mb-4">{selectedGuide.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <FiClock className="w-4 h-4" />
                                    {selectedGuide.duration}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    selectedGuide.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                                    selectedGuide.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {selectedGuide.level}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedGuide.topics.map((topic, index) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <button
                            onClick={() => markAsCompleted(selectedGuide.id)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                completedGuides.includes(selectedGuide.id)
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            disabled={completedGuides.includes(selectedGuide.id)}
                        >
                            <FiCheckCircle className="w-4 h-4 mr-2" />
                            {completedGuides.includes(selectedGuide.id) ? 'Completed' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
                    {/* Introduction */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />
                            <p className="text-blue-800">{selectedGuide.content.introduction}</p>
                        </div>
                    </div>

                    {/* Sections */}
                    {selectedGuide.content.sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                {index + 1}. {section.title}
                            </h2>
                            <div className="space-y-3">
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className="text-gray-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                            <FiAlertCircle className="w-5 h-5" />
                            Pro Tips
                        </h3>
                        <ul className="space-y-2">
                            {selectedGuide.content.tips.map((tip, index) => (
                                <li key={index} className="text-yellow-800 flex items-start gap-2">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Guides
                    </button>
                    
                    <button
                        onClick={() => markAsCompleted(selectedGuide.id)}
                        className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                            completedGuides.includes(selectedGuide.id)
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                        disabled={completedGuides.includes(selectedGuide.id)}
                    >
                        <FiCheckCircle className="w-4 h-4 mr-2" />
                        {completedGuides.includes(selectedGuide.id) ? 'Completed' : 'Mark as Complete'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Guides</h1>
                    <p className="text-gray-600 mt-1">Step-by-step guides to help you master ExpenseTracker</p>
                </div>
                
                {/* Debug: Reset Progress Button (remove in production) */}
                {import.meta.env.DEV && (
                    <button
                        onClick={clearProgress}
                        className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 border border-gray-200 rounded"
                        title="Development only: Reset guide progress"
                    >
                        Reset Progress
                    </button>
                )}
            </div>

            {/* Progress Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(completedGuides.length / guides.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                        {completedGuides.length} of {guides.length} completed
                    </span>
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide) => (
                    <div 
                        key={guide.id} 
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative"
                        onClick={() => handleGuideClick(guide)}
                    >
                        {/* Completion Badge */}
                        {completedGuides.includes(guide.id) && (
                            <div className="absolute top-4 right-4">
                                <FiCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2 pr-8">{guide.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FiClock className="w-3 h-3" />
                                        {guide.duration}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full ${
                                        guide.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                                        guide.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {guide.level}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1">
                                    {guide.topics.map((topic, i) => (
                                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            className={`w-full py-2 rounded-lg transition-colors ${
                                completedGuides.includes(guide.id)
                                    ? 'bg-green-50 text-green-600 border border-green-200'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleGuideClick(guide);
                            }}
                        >
                            {completedGuides.includes(guide.id) ? 'Review Guide' : 'Start Guide'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Quick Start Section */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Quick Start Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <FiUser className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Complete your profile setup</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiPlus className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Add your first transaction</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiBarChart2 className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Explore the dashboard charts</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <FiSettings className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Configure your preferences</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiShield className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Set up security features</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiDownload className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Export your first report</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guides;
