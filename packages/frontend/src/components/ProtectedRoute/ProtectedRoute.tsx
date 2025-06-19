// src/components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { cookieStorage } from 'src/utils/cookie-storage';
import {
  useRecoilState,
} from 'recoil';
import { tokenPairState } from 'src/modules/auth/states/tokenPairState';
import Cookies from 'js-cookie';


const ProtectedRoute = ({ children } : any) => {
  const isAuthenticated = Cookies.get('accessToken');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
