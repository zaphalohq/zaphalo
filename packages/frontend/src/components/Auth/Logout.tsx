import { MdLogout } from "react-icons/md";
import { useAuth } from '@src/modules/auth/hooks/useAuth';
const Logout = () => {
  const { logOut } = useAuth();
  return (
    <>
    <button type="button" onClick={logOut} className="w-full flex gap-2 cursor-pointer focus:outline-none text-gray-200 hover-blacky font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2">
     <span className='text-lg text-violet-500'><MdLogout /></span>
      Sign Out</button>
    </>
  );
};

export default Logout;
