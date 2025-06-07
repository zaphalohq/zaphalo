import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/modules/auth/hooks/useAuth';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {  
    // Clear the user token from localStorage or sessionStorage
    localStorage.removeItem('access_token');

    // Optionally: Make an API call to invalidate the token on the server
    
    // Redirect the user to the login page
    navigate('/login');
  };
  const { logOut } = useAuth();

  return (
    <>
    <button type="button" onClick={logOut} className="w-full cursor-pointer focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Sign Out</button>
    </>
  );
};

export default Logout;
