import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Send, User, QrCode, History } from 'lucide-react';
import { transactionAPI } from '../services/api';
import { updateBalance } from '../store/slices/authSlice';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency, validatePhone } from '../utils/helpers';
import { QUICK_AMOUNTS } from '../utils/constants';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const SendMoney = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ receiverPhone: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [recentContacts] = useState([
    { name: 'Ali Ahmed', phone: '03001234567' },
    { name: 'Sara Khan', phone: '03117654321' },
    { name: 'Hassan Raza', phone: '03225556789' }
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotification();

  const handleQuickAmount = (amount) => {
    setFormData({ ...formData, amount: amount.toString() });
  };

  const handleSelectContact = (contact) => {
    setFormData({ ...formData, receiverPhone: contact.phone });
    setShowRecent(false);
  };

  const validateForm = () => {
    if (!formData.receiverPhone || !formData.amount) {
      notify.error('Please fill all required fields');
      return false;
    }

    if (!validatePhone(formData.receiverPhone)) {
      notify.error('Invalid phone number format');
      return false;
    }

    if (parseFloat(formData.amount) <= 0) {
      notify.error('Amount must be greater than 0');
      return false;
    }

    if (parseFloat(formData.amount) > user?.balance) {
      notify.error('Insufficient balance');
      return false;
    }

    if (formData.receiverPhone === user?.phone) {
      notify.error('Cannot send money to yourself');
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
      const { data } = await transactionAPI.sendMoney(formData);
      dispatch(updateBalance(data.balance));
      notify.success('Money sent successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 text-primary hover:underline"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Send className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send Money</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available: {formatCurrency(user?.balance || 0)}
              </p>
            </div>
          </div>

          <form onSubmit={handleContinue} className="space-y-6">
            {/* Receiver Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Receiver Phone Number
                </label>
                <button
                  type="button"
                  onClick={() => setShowRecent(!showRecent)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <History size={14} />
                  Recent
                </button>
              </div>
              
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="03xxxxxxxxx"
                  value={formData.receiverPhone}
                  onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                  icon={User}
                  required
                />
              </div>

              {showRecent && (
                <div className="mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 space-y-1">
                  {recentContacts.map((contact, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectContact(contact)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <Input
                label="Amount (PKR)"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="1"
              />

              {/* Quick Amount Buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/10 transition-colors text-sm font-semibold"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <Input
              label="Description (Optional)"
              type="text"
              placeholder="What's this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            {/* Fee Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 No transaction fee for amounts under PKR 10,000
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth size="lg">
              Continue
            </Button>
          </form>

          {/* Alternative Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              Or send money via
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                icon={QrCode}
                onClick={() => notify.info('QR Scanner coming soon!')}
              >
                Scan QR
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/request-money')}
              >
                Request Money
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Transaction"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-white" size={40} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(formData.amount)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              to {formData.receiverPhone}
            </p>
          </div>

          <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(formData.amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Transaction Fee</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
              <span className="text-gray-600 dark:text-gray-400">Total</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(formData.amount)}
              </span>
            </div>
          </div>

          {formData.description && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Note</p>
              <p className="text-gray-900 dark:text-white">{formData.description}</p>
            </div>
          )}

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
              Confirm & Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SendMoney;