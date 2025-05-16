import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ban as Bank, ArrowLeft, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import { loginUser } from '../services/api';

interface LocationState {
  message?: string;
}

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState((location.state as LocationState)?.message || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await loginUser(email, password, 'customer');
      login(data.token, data.user);
      navigate('/customer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-12 pb-16 px-4">
        <div className="mb-8 text-center">
          {/* <Link to="/" className="inline-flex items-center text-blue-800 hover:text-blue-900 mb-6">
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link> */}
          <div className="flex justify-center mb-4">
            <Landmark size={36} className="text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Login</h1>
          <p className="text-gray-600">Access your account</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-green-100 border border-green-200 text-green-800 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="mt-1 text-right">
              <a href="#" className="text-sm text-blue-800 hover:text-blue-900">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-800 text-white py-3 rounded-md font-medium hover:bg-blue-900 transition duration-300 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-800 hover:text-blue-900 font-medium">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;