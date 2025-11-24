import {
  useRecoilState,
} from 'recoil';
import { currentUserState } from '@src/modules/auth/states/currentUserState';
import { useState } from 'react';
import UserUpdateDialog from './UserUpdateDialog';
import { FiEdit2 } from 'react-icons/fi';
import { VITE_BACKEND_URL } from '@src/config';




const UserBottomToggle = () => {
  const [currentUser] = useRecoilState(currentUserState);
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return 'Y';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const [isProfileEdit, setIsProfileEdit] = useState(false)



  if (isProfileEdit) {
    return (
      <UserUpdateDialog isProfileEdit={isProfileEdit} setIsProfileEdit={setIsProfileEdit}></UserUpdateDialog>
    )
  }


  return (
    <div className="mt-2 ml-1 border-gray-700 relative border-t pt-2">
      <div className="flex p-2 w-full items-start gap-2 transition-colors relative hover:bg-gray-800/50 rounded-xl">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              {currentUser?.profileImg ? (
                <img src={`${VITE_BACKEND_URL}/files/${currentUser.profileImg}`} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-white">
                  {getInitials(currentUser?.firstName, currentUser?.lastName)}
                </div>
              )}
          </div>
        </div>

        <div className="text-start flex-1">
          <span className="font-bold text-sm block text-gray-100">
            {currentUser?.firstName} {currentUser?.lastName}
          </span>
          <span className="block text-xs text-stone-500">{currentUser?.email}</span>
        </div>

        <button onClick={() => setIsProfileEdit(true)} className="flex items-end justify-start cursor-pointer w-7 h-7 rounded-lg text-gray-300 hover:text-white">
          <FiEdit2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  )
}

export default UserBottomToggle;