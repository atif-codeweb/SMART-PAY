import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Receipt, TrendingUp, CheckCircle, Shield, Gift } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency, formatDate } from '../utils/helpers';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import Button from '../components/Button';
import Loader from '../components/Loader';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const notify = useNotification();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getDashboardStats(),
                adminAPI.getAllUsers()
            ]);
            setStats(statsRes.data.stats);
            setUsers(usersRes.data.users);
        } catch (error) {
            notify.error(error.response?.data?.message || 'Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId) => {
        try {
            const { data } = await adminAPI.verifyKYC(userId);
            setUsers((prev) => prev.map((u) => (u._id === userId ? data.user : u)));
            notify.success('User KYC verified');
        } catch (error) {
            notify.error(error.response?.data?.message || 'Verification failed');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                    <Shield className="text-primary" /> Admin Dashboard
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="blue" />
                    <StatsCard title="Verified Users" value={stats?.verifiedUsers || 0} icon={CheckCircle} color="green" />
                    <StatsCard title="Transactions" value={stats?.totalTransactions || 0} icon={Receipt} color="purple" />
                    <StatsCard title="Total Volume" value={formatCurrency(stats?.totalVolume || 0)} icon={TrendingUp} color="orange" />
                </div>

                <div className="flex gap-2 mb-6">
                    <Button variant={tab === 'overview' ? 'primary' : 'outline'} size="sm" onClick={() => setTab('overview')}>
                        Users
                    </Button>
                    <Button variant="outline" size="sm" icon={Gift} onClick={() => navigate('/offers')}>
                        Manage Offers
                    </Button>
                </div>

                <Card>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">All Users</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500">
                                    <th className="py-3 px-2">Name</th>
                                    <th className="py-3 px-2">Email</th>
                                    <th className="py-3 px-2">Balance</th>
                                    <th className="py-3 px-2">Joined</th>
                                    <th className="py-3 px-2">KYC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b border-gray-100 dark:border-gray-700/50 text-sm">
                                        <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{u.name}</td>
                                        <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{u.email}</td>
                                        <td className="py-3 px-2 text-gray-900 dark:text-white">{formatCurrency(u.balance)}</td>
                                        <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                                        <td className="py-3 px-2">
                                            {u.isKYCVerified ? (
                                                <span className="badge badge-success">Verified</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleVerify(u._id)}
                                                    className="text-primary text-xs font-semibold hover:underline"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
