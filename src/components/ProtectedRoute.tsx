import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  role: 'customer' | 'banker';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`/${role}/login`} />;
  }

  if (user?.role !== role) {
    return <Navigate to={`/${user?.role}/login`} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;