import { Navigate, Outlet } from 'react-router-dom';
import { cookieStorage } from '@src/utils/cookie-storage';

const ProtectedRoute = ({ children } : any) => {
  const isAuthenticated = cookieStorage.getItem('tokenPair')
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
