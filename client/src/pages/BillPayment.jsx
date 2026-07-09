import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, Zap, Wifi, Smartphone, Bookmark } from 'lucide-react';
import { billAPI } from '../services/api';
import { updateBalance } from '../store/slices/authSlice';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency } from '../utils/helpers';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

const BillPayment = () => {
  const [formData, setFormData] = useState({ 
    type: 'electricity', 
    billerName: '', 
    accountNumber: '', 
    amount: '', 
    isSaved: false 
  });
  const [loading, setLoading] = useState(false);
  const [savedBills, setSavedBills] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotification();

  const billTypes = [
    { 
      value: 'electricity', 
      label: 'Electricity', 
      icon: Zap, 
      gradient: 'from-yellow-500 to-yellow-600',
      providers: ['K-Electric', 'LESCO', 'IESCO', 'GEPCO', 'FESCO']
    },
    { 
      value: 'internet', 
      label: 'Internet', 
      icon: Wifi, 
      gradient: 'from-blue-500 to-blue-600',
      providers: ['PTCL', 'Nayatel', 'Storm Fiber', 'Fiberlink']
    },
    { 
      value: 'mobile', 
      label: 'Mobile Recharge', 
      icon: Smartphone, 
      gradient: 'from-green-500 to-green-600',
      providers: ['Jazz', 'Zong', 'Telenor', 'Ufone']
    },
  ];

  useEffect(() => {
    loadSavedBills();
  }, []);

  const loadSavedBills = async () => {
    try {
      const { data } = await billAPI.getSavedBills();
      setSavedBills(data.bills);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSaved(false);
    }
  };

  const selectedType = billTypes.find(t => t.value === formData.type);

  const handleSelectSaved = (bill) => {
    setFormData({
      type: bill.type,
      billerName: bill.billerName,
      accountNumber: bill.accountNumber,
      amount: '',
      isSaved: true
    });
  };

  const validateForm = () => {
    if (!formData.billerName || !formData.accountNumber || !formData.amount) {
      notify.error('Please fill all required fields');
      return false;
    }

    if (parseFloat(formData.amount) <= 0) {
      notify.error('Amount must be greater than 0');
      return false;
    }

    return true;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirm(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await billAPI.payBill(formData);
      dispatch(updateBalance(data.balance));
      notify.success('Bill paid successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      notify.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 text-primary hover:underline"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Bill Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Form */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Select Bill Type
              </h3>

              {/* Bill Type Selector */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {billTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`
                      relative overflow-hidden rounded-xl p-6 text-center transition-all
                      ${formData.type === type.value 
                        ? 'ring-2 ring-primary' 
                        : 'hover:shadow-md'
                      }
                    `}
                  >
                    <div className={`
                      absolute inset-0 bg-gradient-to-r ${type.gradient} 
                      ${formData.type === type.value ? 'opacity-100' : 'opacity-10'}
                      transition-opacity
                    `} />
                    <div className="relative">
                      <type.icon 
                        className={formData.type === type.value ? 'text-white' : 'text-gray-700 dark:text-gray-300'} 
                        size={32} 
                      />
                      <p className={`
                        font-semibold mt-2 text-sm
                        ${formData.type === type.value ? 'text-white' : 'text-gray-800 dark:text-gray-200'}
                      `}>
                        {type.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bill Form */}
              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Service Provider
                  </label>
                  <select
                    value={formData.billerName}
                    onChange={(e) => setFormData({ ...formData, billerName: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select Provider</option>
                    {selectedType?.providers.map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Account/Consumer Number"
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Enter your account number"
                  required
                />

                <Input
                  label="Amount (PKR)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  required
                  min="1"
                />

                <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="checkbox"
                    id="save"
                    checked={formData.isSaved}
                    onChange={(e) => setFormData({ ...formData, isSaved: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="save" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Bookmark size={16} />
                    Save this biller for quick access
                  </label>
                </div>

                <Button type="submit" fullWidth size="lg">
                  Continue to Pay
                </Button>
              </form>
            </Card>
          </div>

          {/* Saved Bills */}
          <div>
            <Card>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Bookmark className="text-primary" />
                Saved Billers
              </h3>

              {loadingSaved ? (
                <Loader size="sm" />
              ) : savedBills.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">
                  No saved billers yet
                </p>
              ) : (
                <div className="space-y-2">
                  {savedBills.map((bill) => {
                    const typeInfo = billTypes.find(t => t.value === bill.type);
                    return (
                      <button
                        key={bill._id}
                        onClick={() => handleSelectSaved(bill)}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {typeInfo && <typeInfo.icon size={16} />}
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {bill.billerName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {bill.accountNumber}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Bill Tips */}
            <Card className="mt-4">
              <h3 className="text-sm font-bold mb-3 text-gray-900 dark:text-white">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Double-check your account number</li>
                <li>• Save billers for faster payments</li>
                <li>• Earn cashback on bill payments</li>
                <li>• Set up auto-pay (coming soon)</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Bill Payment"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className={`w-20 h-20 bg-gradient-to-r ${selectedType?.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {selectedType && <selectedType.icon className="text-white" size={40} />}
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(formData.amount)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {formData.billerName}
            </p>
          </div>

          <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Bill Type</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {formData.type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Account Number</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formData.accountNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(formData.amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              fullWidth
              onClick={handleSubmit}
              loading={loading}
            >
              Pay Bill
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillPayment;