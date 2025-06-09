// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { cookieStorage } from 'src/utils/cookie-storage';

const ProtectedRoute = ({ children } : any) => {
  const isAuthenticated = cookieStorage.getItem('accessToken')

  // return children;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
