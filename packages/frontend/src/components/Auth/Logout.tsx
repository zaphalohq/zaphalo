import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {  
    // Clear the user token from localStorage or sessionStorage
    localStorage.removeItem('access_token');

    // Optionally: Make an API call to invalidate the token on the server
    
    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <>
    <button type="button" onClick={handleLogout} className="w-full cursor-pointer focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Sign Out</button>
    </>
  );
};

export default Logout;
