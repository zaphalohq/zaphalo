import {
  useRecoilState,
} from 'recoil';
import { currentUserState } from '@src/modules/auth/states/currentUserState';


const UserBottomToggle = () => {
  const [currentUser] = useRecoilState(currentUserState);
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return 'Y';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="mt-2 ml-1 border-gray-700 relative border-t pt-2">
      <div className="flex p-0.5 w-full items-start gap-2 transition-colors relative hover:bg-gray-800/50 rounded-xl">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              {currentUser?.firstName && currentUser?.lastName
                ? getInitials(currentUser.firstName, currentUser.lastName)
                : ''
              }
            </span>
          </div>
        </div>

        <div className="text-start flex-1">
          <span className="font-bold text-sm block text-gray-100">
            {currentUser?.firstName} {currentUser?.lastName}
          </span>
          <span className="block text-xs text-stone-500">{currentUser?.email}</span>
        </div>

      </div>
    </div>
  )
}

export default UserBottomToggle;