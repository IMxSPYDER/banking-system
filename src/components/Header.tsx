import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ban as Bank, UserCircle, Menu, X, Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'SecureBank' }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!user) return [];
    
    if (user.role === 'customer') {
      return [
        { text: 'Dashboard', href: '/customer/dashboard' }
      ];
    }
    
    if (user.role === 'banker') {
      return [
        { text: 'Dashboard', href: '/banker/dashboard' },
        { text: 'Customers', href: '/banker/dashboard' }
      ];
    }
    
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to={user ? `/${user.role}/dashboard` : '/'} className="flex items-center">
              <Landmark size={28} className="text-blue-800 mr-2" />
              <span className="text-xl font-semibold text-blue-900">{title}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-gray-700 hover:text-blue-800 font-medium"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center">
                  <UserCircle size={20} className="text-blue-800 mr-2" />
                  <span className="text-gray-700 font-medium">
                    {user.firstName || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-800 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="block py-2 text-gray-700 hover:text-blue-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            {user && (
              <>
                <div className="py-2 text-gray-700 font-medium border-t border-gray-100 mt-2 pt-3">
                  <UserCircle size={18} className="text-blue-800 inline-block mr-2" />
                  {user.firstName || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-600 hover:text-blue-800 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;