// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children } : any) => {
  const isAuthenticated = localStorage.getItem('access_token');
  
  // if (!token) {
  //   // Redirect to login if no token
  //   return <Navigate to="/login" />;
  // }

  // return children;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
