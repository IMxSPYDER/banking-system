import axios from 'axios';

const API_URL = 'https://banking-system-2007.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerCustomer = async (userData: any) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginUser = async (email: string, password: string, role: 'customer' | 'banker') => {
  const response = await api.post('/login', { email, password, role });
  return response.data;
};

export const getCustomerBalance = async () => {
  const response = await api.get('/customer/balance');
  return response.data;
};

export const getCustomerTransactions = async () => {
  const response = await api.get('/customer/transactions');
  return response.data;
};

export const makeDeposit = async (amount: number) => {
  const response = await api.post('/customer/deposit', { amount });
  return response.data;
};

export const makeWithdrawal = async (amount: number) => {
  const response = await api.post('/customer/withdraw', { amount });
  return response.data;
};

export const getCustomersList = async () => {
  const response = await api.get('/banker/customers');
  return response.data;
};

export const getCustomerDetails = async (customerId: string) => {
  const response = await api.get(`/banker/customers/${customerId}`);
  return response.data;
};

export const getCustomerTransactionsById = async (customerId: string) => {
  const response = await api.get(`/banker/customers/${customerId}/transactions`);
  return response.data;
};
