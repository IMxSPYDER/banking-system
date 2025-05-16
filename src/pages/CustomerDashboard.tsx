import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import TransactionModal from '../components/TransactionModal';
import { getCustomerTransactions, getCustomerBalance } from '../services/api';
import TransactionsList from '../components/TransactionsList';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: string;
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [balanceData, transactionsData] = await Promise.all([
        getCustomerBalance(),
        getCustomerTransactions()
      ]);
      
      setBalance(balanceData.balance);
      setTransactions(transactionsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleTransactionSuccess = async () => {
    await fetchData();
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName || 'Customer'}</h1>
          
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-3">
              <RefreshCw size={32} className="text-blue-700" />
            </div>
            <p className="text-gray-600">Loading your account information...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="bg-blue-800 px-6 py-5 text-white">
                <h2 className="text-lg font-medium">Current Balance</h2>
                <p className="text-3xl font-bold mt-2">${balance}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                <button
                  onClick={() => setModalType('deposit')}
                  className="px-6 py-4 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <ArrowUpRight size={20} className="text-green-600" />
                    </div>
                    <span className="font-medium">Deposit Funds</span>
                  </div>
                  <span className="text-sm text-gray-500">Add money →</span>
                </button>
                
                <button
                  onClick={() => setModalType('withdraw')}
                  className="px-6 py-4 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <ArrowDownRight size={20} className="text-red-600" />
                    </div>
                    <span className="font-medium">Withdraw Funds</span>
                  </div>
                  <span className="text-sm text-gray-500">Take money →</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={18} className="text-blue-800 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
                </div>
                <span className="text-sm text-gray-500">{transactions.length} transactions</span>
              </div>
              
              <TransactionsList transactions={transactions} />
            </div>
          </>
        )}
      </div>
      
      {modalType && (
        <TransactionModal
          type={modalType}
          currentBalance={balance}
          onClose={() => setModalType(null)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;