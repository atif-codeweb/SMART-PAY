import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Moon, Sun, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const Settings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-primary hover:underline"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

                {/* Account */}
                <Card className="mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                            <span className={`badge mt-1 ${user?.isKYCVerified ? 'badge-success' : 'badge-warning'}`}>
                                {user?.isKYCVerified ? 'KYC Verified' : 'KYC Pending'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Preferences */}
                <Card className="mb-6">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Preferences</h3>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
                            <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
                        </div>
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-primary" />
                            <span className="text-gray-800 dark:text-gray-200">Notifications</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </Card>

                {/* Security */}
                <Card className="mb-6">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Security</h3>
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center justify-between w-full py-3 text-left"
                    >
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-primary" />
                            <span className="text-gray-800 dark:text-gray-200">Change Password</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                </Card>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Settings;
