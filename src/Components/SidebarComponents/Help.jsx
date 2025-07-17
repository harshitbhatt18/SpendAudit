import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiHelpCircle, FiBook, FiMessageCircle, FiMail, FiPhone, FiExternalLink, FiChevronDown, FiChevronRight, FiStar, FiClock, FiUsers, FiTrendingUp, FiCheck, FiAlertCircle } from 'react-icons/fi';

const Help = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('faq');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);

    const tabs = [
        { id: 'faq', name: 'FAQ', icon: FiHelpCircle },
        { id: 'guides', name: 'User Guides', icon: FiBook },
        { id: 'contact', name: 'Contact Support', icon: FiMessageCircle }
    ];

    const faqs = [
        {
            id: 1,
            question: "How do I add a new expense?",
            answer: "To add a new expense, click the '+' button on the dashboard or go to Transaction History and click 'Add Transaction'. Fill in the amount, category, and description, then click 'Save'.",
            category: "Basic Usage"
        },
        {
            id: 2,
            question: "How can I categorize my expenses?",
            answer: "When adding an expense, you can select from predefined categories like Food, Transport, Entertainment, etc. You can also add custom categories in the Settings section.",
            category: "Basic Usage"
        },
        {
            id: 3,
            question: "How do I view my spending reports?",
            answer: "Navigate to the Reports section from the sidebar. Here you'll find comprehensive analytics including monthly trends, category breakdowns, and financial insights.",
            category: "Reports"
        },
        {
            id: 4,
            question: "Can I export my transaction data?",
            answer: "Yes! In the Reports section, click the 'Export Report' button to download your financial data in various formats including PDF and Excel.",
            category: "Data Export"
        },
        {
            id: 5,
            question: "How do I set up notifications?",
            answer: "Go to Settings > Notifications to configure email, push, and SMS notifications. You can also set up weekly expense summaries.",
            category: "Settings"
        },
        {
            id: 6,
            question: "Is my financial data secure?",
            answer: "Absolutely! We use industry-standard encryption and security measures. Your data is stored securely with Supabase, and we never share your personal information.",
            category: "Security"
        },
        {
            id: 7,
            question: "How do I change my password?",
            answer: "Navigate to Settings > Security and enter your current password, then set a new password. We also recommend enabling two-factor authentication for extra security.",
            category: "Security"
        },
        {
            id: 8,
            question: "Can I track income as well as expenses?",
            answer: "Yes! When adding a transaction, you can select either 'Income' or 'Expense' as the transaction type. This helps you track your complete financial picture.",
            category: "Basic Usage"
        }
    ];

    const guides = [
        {
            title: "Getting Started with ExpenseTracker",
            description: "A complete guide to setting up your account and adding your first transactions",
            duration: "5 min read",
            level: "Beginner",
            topics: ["Account Setup", "First Transaction", "Dashboard Overview"]
        },
        {
            title: "Understanding Your Financial Reports",
            description: "Learn how to interpret charts, analyze spending patterns, and make informed decisions",
            duration: "8 min read",
            level: "Intermediate",
            topics: ["Charts Analysis", "Spending Patterns", "Financial Insights"]
        },
        {
            title: "Advanced Features & Tips",
            description: "Maximize your expense tracking with advanced features and best practices",
            duration: "10 min read",
            level: "Advanced",
            topics: ["Categories Management", "Data Export", "Security Settings"]
        },
        {
            title: "Mobile Usage Guide",
            description: "Tips for using ExpenseTracker on mobile devices and responsive features",
            duration: "4 min read",
            level: "Beginner",
            topics: ["Mobile Interface", "Touch Gestures", "Offline Usage"]
        }
    ];

    const contactMethods = [
        {
            icon: FiMail,
            title: "Email Support",
            description: "Get help via email within 24 hours",
            contact: "support@expensetracker.com",
            availability: "24/7",
            action: () => window.open('mailto:support@expensetracker.com?subject=ExpenseTracker Support Request', '_blank')
        },
        {
            icon: FiPhone,
            title: "Phone Support",
            description: "Speak directly with our support team",
            contact: "+91 1800-123-4567",
            availability: "Mon-Fri, 10 AM - 5 PM IST",
            action: () => window.open('tel:+911800123456', '_blank')
        }
    ];

    const handleContactFormChange = (field, value) => {
        setContactForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContactFormSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            alert('Please fill in all fields');
            return;
        }

        // Simulate form submission
        console.log('Contact form submitted:', contactForm);
        
        // In a real app, you would send this to your backend
        // For now, we'll just show a success message
        setContactSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setContactSubmitted(false);
            setContactForm({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    const handleGuideView = (guide) => {
        // Navigate to the dedicated Guides section
        navigate('/dashboard/guides');
    };

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Help & Support</h1>
                    <p className="text-gray-600 mt-1">Find answers, guides, and get support for ExpenseTracker</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full lg:w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                        <FiUsers className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-600">Active Users</p>
                            <p className="text-2xl font-bold text-blue-800">10K+</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                        <FiStar className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-sm text-green-600">Satisfaction</p>
                            <p className="text-2xl font-bold text-green-800">4.9/5</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                        <FiClock className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-sm text-purple-600">Avg Response</p>
                            <p className="text-2xl font-bold text-purple-800">2 hrs</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                        <FiTrendingUp className="w-8 h-8 text-red-600" />
                        <div>
                            <p className="text-sm text-red-600">Issues Resolved</p>
                            <p className="text-2xl font-bold text-red-800">99%</p>
                        </div>
                    </div>
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
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
                        
                        {searchQuery && (
                            <p className="text-sm text-gray-600 mb-4">
                                Found {filteredFAQs.length} result(s) for "{searchQuery}"
                            </p>
                        )}
                        
                        <div className="space-y-4">
                            {filteredFAQs.map((faq) => (
                                <div key={faq.id} className="border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <div>
                                            <h4 className="font-medium text-gray-900">{faq.question}</h4>
                                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full mt-2 inline-block">
                                                {faq.category}
                                            </span>
                                        </div>
                                        {expandedFAQ === faq.id ? 
                                            <FiChevronDown className="w-5 h-5 text-gray-400" /> : 
                                            <FiChevronRight className="w-5 h-5 text-gray-400" />
                                        }
                                    </button>
                                    {expandedFAQ === faq.id && (
                                        <div className="p-4 pt-0 border-t border-gray-100">
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Guides Tab */}
            {activeTab === 'guides' && (
                <div className="space-y-6">
                    {/* Full Guides Section Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">Complete User Guides Available</h3>
                                <p className="text-blue-800 mb-4">Access our comprehensive, step-by-step guides with full content, progress tracking, and interactive features.</p>
                                <button 
                                    onClick={() => navigate('/dashboard/guides')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <FiBook className="w-4 h-4" />
                                    Go to Full Guides Section
                                </button>
                            </div>
                            <FiBook className="w-12 h-12 text-blue-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {guides.map((guide, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                                 onClick={() => handleGuideView(guide)}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
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
                                    <FiExternalLink className="w-4 h-4 text-gray-400 mt-1" />
                                </div>
                                
                                <button 
                                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGuideView(guide);
                                    }}
                                >
                                    Read Full Guide
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-red-100 rounded-lg">
                                        <method.icon className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{method.title}</h3>
                                        <p className="text-sm text-gray-500">{method.availability}</p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 mb-4">{method.description}</p>
                                
                                <button 
                                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    onClick={method.action}
                                >
                                    {method.contact}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {/* Contact Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Send us a Message</h3>
                        
                        {contactSubmitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheck className="w-8 h-8 text-green-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Message Sent Successfully!</h4>
                                <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactFormSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={contactForm.name}
                                        onChange={(e) => handleContactFormChange('name', e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={contactForm.email}
                                        onChange={(e) => handleContactFormChange('email', e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={contactForm.subject}
                                    onChange={(e) => handleContactFormChange('subject', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
                                    required
                                />
                                <textarea
                                    placeholder="Describe your issue or question..."
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Help;
