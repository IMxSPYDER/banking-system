import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <div className="flex items-center space-x-2">
            <Landmark size={32} className="text-blue-800" />
            <h1 className="text-2xl font-bold text-blue-900">SecureBank</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/customer/login" 
              className="text-blue-700 hover:text-blue-900 font-medium"
            >
              Customer Login
            </Link>
            <Link 
              to="/banker/login" 
              className="text-blue-700 hover:text-blue-900 font-medium"
            >
              Banker Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition duration-300"
            >
              Register
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-12">
          {/* Left section */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
              Banking made simple, secure, and transparent
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Experience hassle-free banking with real-time transactions, detailed history tracking, and 24/7 access to your finances.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link 
                to="/register" 
                className="bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition duration-300 font-medium text-center"
              >
                Get Started
              </Link>
              <Link 
                to="/customer/login" 
                className="border border-blue-800 text-blue-800 px-6 py-3 rounded-md hover:bg-blue-50 transition duration-300 font-medium text-center"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="bg-blue-800 rounded-lg p-4 sm:p-6 text-white mb-6 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-1">Our Services</h3>
              <p className="opacity-90 text-sm">Modern banking solutions for your everyday needs</p>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Easy Registration', description: 'Create an account in minutes' },
                { title: 'Secure Transactions', description: 'Deposit and withdraw with confidence' },
                { title: 'Transaction History', description: 'Keep track of all your banking activities' },
                { title: 'Customer Support', description: 'Get help from our banking professionals' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-blue-50 rounded-md transition duration-300">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-800 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2025 SecureBank. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
