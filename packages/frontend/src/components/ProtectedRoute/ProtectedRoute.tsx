// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';


const ProtectedRoute = ({ children } : any) => {
  const isAuthenticated = Cookies.get('accessToken');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
