import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Wallet } from 'lucide-react';
import { userAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency, getBudgetStatus } from '../utils/helpers';
import { SPENDING_CATEGORIES } from '../utils/constants';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Budget = () => {
    const navigate = useNavigate();
    const notify = useNotification();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ category: 'transfer', limit: '' });

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        try {
            const { data } = await userAPI.getBudgets();
            setBudgets(data.budgets || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.limit || parseFloat(form.limit) <= 0) {
            notify.error('Enter a valid limit');
            return;
        }
        setSaving(true);
        try {
            const { data } = await userAPI.createBudget({
                category: form.category,
                limit: parseFloat(form.limit)
            });
            setBudgets(data.budgets);
            notify.success('Budget saved');
            setShowModal(false);
            setForm({ category: 'transfer', limit: '' });
        } catch (error) {
            notify.error(error.response?.data?.message || 'Failed to save budget');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-primary hover:underline"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Wallet className="text-primary" /> Budgets
                    </h1>
                    <Button icon={Plus} onClick={() => setShowModal(true)}>
                        New Budget
                    </Button>
                </div>

                {budgets.length === 0 ? (
                    <EmptyState
                        title="No budgets set"
                        description="Create a monthly budget to track your spending"
                        actionLabel="Create Budget"
                        onAction={() => setShowModal(true)}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {budgets.map((budget, idx) => {
                            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                            const status = getBudgetStatus(budget.spent, budget.limit);
                            const label = SPENDING_CATEGORIES.find(c => c.value === budget.category)?.label || budget.category;
                            return (
                                <Card key={idx}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-gray-900 dark:text-white capitalize">{label}</h3>
                                        <span className="text-sm text-gray-500">{budget.month}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                                        <div
                                            className={`h-3 rounded-full bg-${status.color}-500`}
                                            style={{ width: `${percentage}%`, backgroundColor: status.color === 'red' ? '#ef4444' : status.color === 'yellow' ? '#f59e0b' : '#22c55e' }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Spent {formatCurrency(budget.spent)}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            of {formatCurrency(budget.limit)}
                                        </span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Budget" size="sm">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="input"
                        >
                            {SPENDING_CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Monthly Limit (PKR)"
                        type="number"
                        min="1"
                        value={form.limit}
                        onChange={(e) => setForm({ ...form, limit: e.target.value })}
                        required
                    />
                    <Button type="submit" fullWidth loading={saving}>Save Budget</Button>
                </form>
            </Modal>
        </div>
    );
};

export default Budget;
