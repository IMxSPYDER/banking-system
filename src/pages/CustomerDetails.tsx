import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import TransactionsList from '../components/TransactionsList';
import { getCustomerDetails, getCustomerTransactionsById } from '../services/api';

interface CustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dob: string;
  created_at: string;
  balance: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: string;
}

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const [customerData, transactionsData] = await Promise.all([
        getCustomerDetails(id),
        getCustomerTransactionsById(id)
      ]);
      
      setCustomer(customerData);
      console.log(customer)
      setTransactions(transactionsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Banker Portal" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/banker/dashboard" className="inline-flex items-center text-blue-800 hover:text-blue-900 mr-4">
              <ArrowLeft size={16} className="mr-1" />
              Back to Customers
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
          </div>
          
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
            <p className="text-gray-600">Loading customer information...</p>
          </div>
        ) : !customer ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600">Customer not found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                <User size={18} className="text-blue-800 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
                    <p className="text-lg font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                    <p className="text-lg font-medium text-gray-900">{customer.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Age</h3>
                    <p className="text-lg font-medium text-gray-900">{customer.age}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Date of Birth</h3>
                    <p className="text-lg font-medium text-gray-900">{formatDate(customer.dob)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Account Created</h3>
                    <p className="text-lg font-medium text-gray-900">{formatDate(customer.created_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Balance</h3>
                    <p className="text-lg font-bold text-blue-800">${customer.balance}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
                <span className="text-sm text-gray-500">{transactions.length} transactions</span>
              </div>
              
              <TransactionsList transactions={transactions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;