import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, Filter, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { transactionAPI } from '../services/api';
import { formatCurrency, formatDate, groupTransactionsByDate } from '../utils/helpers';
import { CHART_COLORS, SPENDING_CATEGORIES } from '../utils/constants';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import TransactionCard from '../components/TransactionCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Button from '../components/Button';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', search: '', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [currentPage, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [txnRes, analyticsRes] = await Promise.all([
        transactionAPI.getTransactions({ 
          page: currentPage, 
          ...filters 
        }),
        transactionAPI.getAnalytics()
      ]);
      setTransactions(txnRes.data.transactions);
      setTotalPages(txnRes.data.totalPages);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = analytics ? Object.keys(analytics.spending).map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    spending: analytics.spending[date] || 0,
    income: analytics.income[date] || 0
  })).slice(-30) : [];

  const categoryData = analytics ? Object.keys(analytics.categorySpending).map(category => ({
    name: SPENDING_CATEGORIES.find(c => c.value === category)?.label || category,
    value: analytics.categorySpending[category]
  })) : [];

  const COLORS = [CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info];

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Description', 'Type', 'Amount', 'Status'],
      ...transactions.map(t => [
        formatDate(t.createdAt),
        t.description || t.type,
        t.type,
        t.amount,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 mb-2 text-primary hover:underline"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions & Analytics</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button 
              variant="outline" 
              icon={Download}
              onClick={exportTransactions}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input"
                >
                  <option value="">All Types</option>
                  <option value="send">Sent</option>
                  <option value="receive">Received</option>
                  <option value="bill_payment">Bills</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="input"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  variant="secondary"
                  fullWidth
                  onClick={() => setFilters({ type: '', search: '', startDate: '', endDate: '' })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Spending vs Income Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke={CHART_COLORS.danger} 
                  strokeWidth={3}
                  name="Spending"
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke={CHART_COLORS.success} 
                  strokeWidth={3}
                  name="Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Spending by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Transaction History
          </h3>

          {loading ? (
            <Loader />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="Try adjusting your filters or make your first transaction"
              actionLabel="Send Money"
              onAction={() => navigate('/send-money')}
            />
          ) : (
            <>
              {Object.keys(groupedTransactions).map((date) => (
                <div key={date} className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <Calendar size={16} />
                    {date}
                  </h4>
                  <div className="space-y-3">
                    {groupedTransactions[date].map((txn) => (
                      <TransactionCard 
                        key={txn._id} 
                        transaction={txn}
                        onClick={() => setSelectedTransaction(txn)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Modal
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          title="Transaction Details"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(selectedTransaction.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">
                  {selectedTransaction.type.replace('_', ' ')}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <span className={`
                  badge
                  ${selectedTransaction.status === 'completed' ? 'badge-success' : ''}
                  ${selectedTransaction.status === 'pending' ? 'badge-warning' : ''}
                  ${selectedTransaction.status === 'failed' ? 'badge-danger' : ''}
                `}>
                  {selectedTransaction.status}
                </span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedTransaction.createdAt)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reference</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  #{selectedTransaction._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {selectedTransaction.description && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-900 dark:text-white">{selectedTransaction.description}</p>
              </div>
            )}

            {selectedTransaction.cashback > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300 mb-1">🎉 Cashback Earned</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(selectedTransaction.cashback)}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Transactions;