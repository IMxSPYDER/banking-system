import { useState } from 'react';
import { X } from 'lucide-react';
import InputField from './InputField';
import { makeDeposit, makeWithdrawal } from '../services/api';

interface TransactionModalProps {
  type: 'deposit' | 'withdraw';
  currentBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionModal = ({
  type,
  currentBalance,
  onClose,
  onSuccess,
}: TransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError('');
  };

  const validateTransaction = () => {
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue)) {
      setError('Please enter a valid amount');
      return false;
    }

    if (amountValue <= 0) {
      setError('Amount must be greater than zero');
      return false;
    }

    if (type === 'withdraw' && amountValue > currentBalance) {
      setError('Insufficient funds');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTransaction()) return;
    
    setIsProcessing(true);
    try {
      if (type === 'deposit') {
        await makeDeposit(parseFloat(amount));
      } else {
        await makeWithdrawal(parseFloat(amount));
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md animate-scale-in">
        <div className="px-6 py-4 bg-blue-800 text-white flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Current Balance:</p>
            <p className="text-2xl font-bold text-gray-900">${currentBalance}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <InputField
            label={`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Amount ($)`}
            name="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
          />

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? 'Processing...' : type === 'deposit' ? 'Deposit' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;