import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Send, Receipt, PieChart, Gift, Eye, EyeOff, TrendingUp, Award, Plus } from 'lucide-react';
import { transactionAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import TransactionCard from '../components/TransactionCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await transactionAPI.getTransactions({ limit: 5 });
                setTransactions(data.transactions);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const quickActions = [
        { label: 'Send Money', icon: Send, color: 'from-blue-500 to-blue-600', to: '/send-money' },
        { label: 'Pay Bills', icon: Receipt, color: 'from-yellow-500 to-yellow-600', to: '/bills' },
        { label: 'Transactions', icon: PieChart, color: 'from-purple-500 to-purple-600', to: '/transactions' },
        { label: 'Offers', icon: Gift, color: 'from-green-500 to-green-600', to: '/offers' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Here's your wallet overview</p>
                </div>

                {/* Balance Card */}
                <div className="gradient-primary rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-white/80">Total Balance</p>
                        <button onClick={() => setShowBalance(!showBalance)}>
                            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                    <p className="text-4xl font-bold mb-6">
                        {showBalance ? formatCurrency(user?.balance || 0) : '••••••'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/send-money')}
                            className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <Send size={18} /> Send
                        </button>
                        <button
                            onClick={() => navigate('/bills')}
                            className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} /> Pay Bill
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <StatsCard
                        title="Reward Points"
                        value={user?.rewardPoints || 0}
                        icon={Award}
                        color="purple"
                    />
                    <StatsCard
                        title="Account Status"
                        value={user?.isKYCVerified ? 'Verified' : 'Pending'}
                        icon={TrendingUp}
                        color={user?.isKYCVerified ? 'green' : 'orange'}
                    />
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.to)}
                            className="card hover-lift flex flex-col items-center gap-3 py-6"
                        >
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                                <action.icon className="text-white" size={24} />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="text-primary font-semibold text-sm hover:underline"
                    >
                        View All
                    </button>
                </div>

                <Card>
                    {loading ? (
                        <Loader />
                    ) : transactions.length === 0 ? (
                        <EmptyState
                            title="No transactions yet"
                            description="Start by sending money or paying a bill"
                            actionLabel="Send Money"
                            onAction={() => navigate('/send-money')}
                        />
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((txn) => (
                                <TransactionCard
                                    key={txn._id}
                                    transaction={txn}
                                    onClick={() => navigate('/transactions')}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
