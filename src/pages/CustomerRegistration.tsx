import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark } from 'lucide-react';
import InputField from '../components/InputField';
import { registerCustomer } from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  dob: string;
  email: string;
  password: string;
  confirmPassword: string;
  initialAmount: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  dob?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  initialAmount?: string;
  general?: string;
}

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialAmount: '0',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    const ageValue = parseInt(formData.age);
    if (!formData.age || isNaN(ageValue)) newErrors.age = 'Valid age is required';
    else if (ageValue < 18) newErrors.age = 'You must be at least 18 years old';

    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18) newErrors.dob = 'You must be at least 18 years old';
    }

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = 'Invalid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    const amount = parseFloat(formData.initialAmount);
    if (isNaN(amount) || amount < 0) newErrors.initialAmount = 'Initial amount must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...payloadToSend } = formData;
      await registerCustomer(payloadToSend);
      setIsLoading(false);
      navigate('/customer/login', {
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (error: any) {
      setIsLoading(false);
      setErrors({
        general: error.response?.data?.error || 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-blue-800 text-white p-8 md:p-12 flex flex-col justify-center">
        <Link to="/" className="inline-flex items-center text-white hover:text-gray-300 mb-6">
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl flex items-center gap-4 font-bold mb-4">
          <Landmark size={36} />
          Welcome to SecureBank
        </h1>
        <p className="text-base leading-relaxed">
          Our mission is to provide a safe and seamless banking experience for individuals and businesses alike. 
          With advanced encryption, multi-factor authentication, and real-time monitoring, your data and transactions 
          are always protected. Join thousands who trust SecureBank for secure, smart, and stress-free banking.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h2>
          <p className="text-gray-600 mb-6">
            Don’t have an account? It takes less than a minute. If you already have an account{' '}
            <Link to="/customer/login" className="text-blue-800 hover:underline">Login</Link>.
          </p>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-800 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField name="firstName" label="Firstname" type="text" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
              <InputField name="lastName" label="Lastname" type="text" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField name="age" label="Age" type="number" value={formData.age} onChange={handleChange} error={errors.age} />
              <InputField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} />
            </div>
            <InputField name="email" label="Email address" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <div className="grid md:grid-cols-2 gap-4">
              <InputField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
              <InputField name="confirmPassword" label="Re-enter password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            </div>
            <InputField name="initialAmount" label="Initial Deposit Amount ($)" type="number" value={formData.initialAmount} onChange={handleChange} error={errors.initialAmount} />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-800 text-white py-3 rounded-md font-medium hover:bg-blue-900 transition duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
