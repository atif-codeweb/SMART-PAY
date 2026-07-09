import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Wallet, Moon, Sun, LogOut, User, Menu, X, LayoutDashboard, Send, Receipt, Gift, PieChart, Settings, Shield } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { formatCurrency } from '../utils/helpers';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const links = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/send-money', label: 'Send', icon: Send },
        { to: '/bills', label: 'Bills', icon: Receipt },
        { to: '/transactions', label: 'Transactions', icon: PieChart },
        { to: '/offers', label: 'Offers', icon: Gift },
        { to: '/budget', label: 'Budget', icon: Wallet }
    ];

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <Wallet className="text-primary" size={28} />
                        <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">SmartPay</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        ))}
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                            >
                                <Shield size={16} />
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:block text-right mr-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {formatCurrency(user?.balance || 0)}
                            </p>
                        </div>

                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link
                            to="/settings"
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block"
                        >
                            <Settings size={20} />
                        </Link>

                        <Link
                            to="/profile"
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <User size={20} />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors hidden sm:block"
                            aria-label="Logout"
                        >
                            <LogOut size={20} />
                        </button>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <link.icon size={18} />
                                {link.label}
                            </Link>
                        ))}
                        {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10">
                                <Shield size={18} /> Admin
                            </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 w-full">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
