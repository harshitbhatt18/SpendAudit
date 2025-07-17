import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../contexts/supabaseClient';
import Loading, { InlineLoading } from '../Loading';
import { FiUser, FiLock, FiBell, FiEye, FiEyeOff, FiSave, FiCamera, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheck, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const Settings = () => {
    const { currentUser, updateProfile, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [userPreferences, setUserPreferences] = useState(null);
    const [showProfilePictureMenu, setShowProfilePictureMenu] = useState(false);

    // Default preferences structure
    const defaultPreferences = {
        currency: 'INR',
        language: 'en',
        timezone: 'Asia/Kolkata',
        date_format: 'DD/MM/YYYY',
        notifications: {
            email: true,
            push: false,
            sms: false,
            weekly: true
        },
        privacy: {
            profile_visibility: 'private',
            data_sharing: false
        }
    };

    // State for form data
    const [notifications, setNotifications] = useState(defaultPreferences.notifications);

    const [profileData, setProfileData] = useState({
        name: currentUser?.user_metadata?.name || '',
        email: currentUser?.email || '',
        phone: '',
        location: '',
        dateOfBirth: '',
        bio: ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Profile picture state
    const [profilePicture, setProfilePicture] = useState(
        currentUser?.user_metadata?.avatar_url || 'https://i.pravatar.cc/100?img=1'
    );
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);

    // Load user preferences from database
    useEffect(() => {
        if (currentUser) {
            loadUserPreferences();
            // Load profile data from user metadata
            setProfileData({
                name: currentUser?.user_metadata?.name || '',
                email: currentUser?.email || '',
                phone: currentUser?.user_metadata?.phone || '',
                location: currentUser?.user_metadata?.location || '',
                dateOfBirth: currentUser?.user_metadata?.dateOfBirth || '',
                bio: currentUser?.user_metadata?.bio || ''
            });

            // Load profile picture from user metadata
            setProfilePicture(
                currentUser?.user_metadata?.avatar_url || 'https://i.pravatar.cc/100?img=1'
            );

            // Fallback timeout - if preferences don't load in 5 seconds, use defaults
            const timeout = setTimeout(() => {
                setUserPreferences(prev => {
                    if (prev === null) {
                        console.log('Database timeout - using default preferences');
                        setNotifications(defaultPreferences.notifications);
                        return defaultPreferences;
                    }
                    return prev;
                });
            }, 5000);

            return () => clearTimeout(timeout);
        } else {
            // If no user, set default preferences so component doesn't stay in loading state
            setUserPreferences({});
        }
    }, [currentUser]); // Only depend on currentUser

    // Database functions
    const loadUserPreferences = async () => {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error loading preferences:', error);
                // If table doesn't exist, use default preferences
                setUserPreferences(defaultPreferences);
                return;
            }

            if (data) {
                setUserPreferences(data);
                setNotifications(data.notifications || defaultPreferences.notifications);
            } else {
                // Create default preferences if none exist
                await createDefaultPreferences();
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
            // Fallback to default preferences if database is not available
            setUserPreferences(defaultPreferences);
            setNotifications(defaultPreferences.notifications);
        }
    };

    const createDefaultPreferences = async () => {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .insert([{
                    user_id: currentUser.id,
                    ...defaultPreferences
                }])
                .select()
                .single();

            if (error) {
                console.error('Error creating default preferences:', error);
                // Use local state if database insert fails
                setUserPreferences(defaultPreferences);
                return;
            }

            setUserPreferences(data);
        } catch (error) {
            console.error('Error creating default preferences:', error);
            // Fallback to local default preferences
            setUserPreferences(defaultPreferences);
        }
    };

    const savePreferencesToDatabase = async (preferences) => {
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: currentUser.id,
                    ...preferences,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error saving preferences:', error);
                // Save to localStorage as fallback
                localStorage.setItem('userPreferences', JSON.stringify(preferences));
                showMessage('warning', 'Settings saved locally. They will sync when online.');
                return false;
            }

            showMessage('success', 'Settings saved successfully!');
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            // Save to localStorage as fallback
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            showMessage('warning', 'Settings saved locally. They will sync when online.');
            return false;
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            // Validate email
            if (!validateEmail(profileData.email)) {
                showMessage('error', 'Please enter a valid email address');
                setLoading(false);
                return;
            }

            // Validate required fields
            if (!profileData.name.trim()) {
                showMessage('error', 'Name is required');
                setLoading(false);
                return;
            }

            // Update user metadata in Supabase Auth
            const { error } = await supabase.auth.updateUser({
                data: {
                    name: profileData.name,
                    phone: profileData.phone,
                    location: profileData.location,
                    dateOfBirth: profileData.dateOfBirth,
                    bio: profileData.bio,
                    avatar_url: profilePicture
                }
            });

            if (error) {
                showMessage('error', 'Failed to update profile: ' + error.message);
                return;
            }

            // Refresh the user context to update sidebar immediately
            if (refreshUser) {
                await refreshUser();
            }
            
            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            showMessage('error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSecurityUpdate = async () => {
        setLoading(true);
        try {
            // Validate current password (in real app, verify with backend)
            if (!securityData.currentPassword) {
                showMessage('error', 'Current password is required');
                setLoading(false);
                return;
            }

            // Validate new password
            if (securityData.newPassword.length < 6) {
                showMessage('error', 'New password must be at least 6 characters long');
                setLoading(false);
                return;
            }

            // Validate password confirmation
            if (securityData.newPassword !== securityData.confirmPassword) {
                showMessage('error', 'New passwords do not match');
                setLoading(false);
                return;
            }

            // Update password in Supabase Auth
            const { error } = await supabase.auth.updateUser({
                password: securityData.newPassword
            });

            if (error) {
                showMessage('error', 'Failed to update password: ' + error.message);
                return;
            }

            // Clear form
            setSecurityData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            showMessage('success', 'Password updated successfully!');
        } catch (error) {
            showMessage('error', 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        try {
            const updatedPreferences = {
                ...userPreferences,
                notifications
            };
            
            const success = await savePreferencesToDatabase(updatedPreferences);
            if (success) {
                setUserPreferences(updatedPreferences);
            }
        } catch (error) {
            showMessage('error', 'Failed to save notification preferences. Please try again.');
        }
    };

    // Profile picture handlers
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showMessage('error', 'Please select a valid image file (JPEG, PNG, or GIF)');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                showMessage('error', 'File size must be less than 5MB');
                return;
            }

            uploadProfilePicture(file);
        }
    };

    const uploadProfilePicture = async (file) => {
        setIsUploadingPicture(true);
        try {
            // Create a file reader to convert to base64 for preview
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newProfilePicture = e.target.result;
                setProfilePicture(newProfilePicture);

                // Update user metadata with new avatar URL
                const { error } = await supabase.auth.updateUser({
                    data: {
                        avatar_url: newProfilePicture
                    }
                });

                if (error) {
                    showMessage('error', 'Failed to update profile picture: ' + error.message);
                    return;
                }

                // Refresh the user context to update sidebar immediately
                if (refreshUser) {
                    await refreshUser();
                }

                showMessage('success', 'Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);

            // In a real app, you would upload to Supabase Storage first
            // For now, we'll simulate the upload time
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            showMessage('error', 'Failed to upload profile picture. Please try again.');
        } finally {
            setIsUploadingPicture(false);
        }
    };

    const triggerProfilePictureUpload = () => {
        document.getElementById('profile-picture-upload').click();
        setShowProfilePictureMenu(false);
    };

    const removeProfilePicture = async () => {
        setIsUploadingPicture(true);
        try {
            const defaultAvatar = 'https://i.pravatar.cc/100?img=1';
            setProfilePicture(defaultAvatar);

            // Update user metadata to remove avatar URL
            const { error } = await supabase.auth.updateUser({
                data: {
                    avatar_url: defaultAvatar
                }
            });

            if (error) {
                showMessage('error', 'Failed to remove profile picture: ' + error.message);
                return;
            }

            // Refresh the user context to update sidebar immediately
            if (refreshUser) {
                await refreshUser();
            }

            showMessage('success', 'Profile picture removed successfully!');
        } catch (error) {
            console.error('Error removing profile picture:', error);
            showMessage('error', 'Failed to remove profile picture. Please try again.');
        } finally {
            setIsUploadingPicture(false);
            setShowProfilePictureMenu(false);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: FiUser },
        { id: 'security', name: 'Security', icon: FiLock },
        { id: 'notifications', name: 'Notifications', icon: FiBell }
    ];

    // Show loading while preferences are being loaded
    if (currentUser && userPreferences === null) {
        return (
            <div className="p-4 sm:p-6">
                <Loading message="Loading preferences..." />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-50 text-green-800' :
                    message.type === 'error' ? 'bg-red-50 text-red-800' :
                    'bg-yellow-50 text-yellow-800'
                }`}>
                    {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                        
                        {/* Profile Picture */}
                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative">
                                <img 
                                    src={profilePicture} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-full border-4 border-gray-100 object-cover"
                                />
                                <button 
                                    onClick={triggerProfilePictureUpload}
                                    disabled={isUploadingPicture}
                                    className={`absolute -bottom-1 -right-1 p-2 rounded-full transition-colors ${
                                        isUploadingPicture 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-red-600 hover:bg-red-700'
                                    } text-white`}
                                >
                                    {isUploadingPicture ? (
                                        <InlineLoading size="xs" />
                                    ) : (
                                        <FiCamera className="w-3 h-3" />
                                    )}
                                </button>
                                {/* Hidden file input */}
                                <input
                                    id="profile-picture-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{profileData.name || 'User'}</h4>
                                <p className="text-gray-500 text-sm">{profileData.email}</p>
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowProfilePictureMenu(!showProfilePictureMenu)}
                                        disabled={isUploadingPicture}
                                        className={`text-sm transition-colors ${
                                            isUploadingPicture 
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-red-600 hover:text-red-700'
                                        }`}
                                    >
                                        {isUploadingPicture ? 'Processing...' : 'Change profile picture'}
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {showProfilePictureMenu && (
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                            <button
                                                onClick={triggerProfilePictureUpload}
                                                disabled={isUploadingPicture}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <FiCamera className="w-4 h-4" />
                                                Upload new picture
                                            </button>
                                            <button
                                                onClick={removeProfilePicture}
                                                disabled={isUploadingPicture}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                                Remove picture
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FiUser className="inline w-4 h-4 mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FiMail className="inline w-4 h-4 mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FiPhone className="inline w-4 h-4 mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FiCalendar className="inline w-4 h-4 mr-2" />
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FiMapPin className="inline w-4 h-4 mr-2" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="City, Country"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleProfileUpdate}
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-700'
                                } text-white`}
                            >
                                {loading ? <InlineLoading size="sm" /> : <FiSave className="w-4 h-4" />}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={securityData.currentPassword}
                                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none pr-10"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={securityData.newPassword}
                                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Enter new password"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={securityData.confirmPassword}
                                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSecurityUpdate}
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-700'
                                } text-white`}
                            >
                                {loading ? <InlineLoading size="sm" /> : <FiSave className="w-4 h-4" />}
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({...notifications, email: !notifications.email})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        notifications.email ? 'bg-red-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            notifications.email ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                                    <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({...notifications, push: !notifications.push})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        notifications.push ? 'bg-red-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            notifications.push ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        notifications.sms ? 'bg-red-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            notifications.sms ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Weekly Summary</h4>
                                    <p className="text-sm text-gray-500">Receive weekly expense summary</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({...notifications, weekly: !notifications.weekly})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        notifications.weekly ? 'bg-red-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            notifications.weekly ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleNotificationUpdate}
                                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <FiSave className="w-4 h-4" />
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {showProfilePictureMenu && (
                <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setShowProfilePictureMenu(false)}
                />
            )}
        </div>
    );
};

export default Settings;
