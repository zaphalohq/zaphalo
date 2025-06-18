import { useGetCurrentUserLazyQuery } from "@src/generated/graphql";
import { getItem } from "@utils/localStorage"
import { useEffect, useState } from "react"
import { FiBriefcase, FiChevronDown, FiChevronRight, FiChevronsDown } from "react-icons/fi"
import {
  useRecoilState,
} from 'recoil';

import { workspacesState } from 'src/modules/auth/states/workspaces';
import { currentUserState } from 'src/modules/auth/states/currentUserState';

const AccountToggle = () => {

  const [getCurrentUser] = useGetCurrentUserLazyQuery();

// useEffect(() => {
//     const getCurrentUser1 = async () => {
//     const currentUserResult = await getCurrentUser({
//       fetchPolicy: 'network-only',
//     });

//     console.log(currentUserResult,"currentUserResultcurrentUserResultcurrentUserResultcurrentUserResultcurrentUserResultcurrentUserResult");
    
// }
// getCurrentUser1()
// },[getCurrentUser])
    
    const [workspaces, setWorkspacesState]= useRecoilState(workspacesState);
    const [currentUser, setcurrentUserState]= useRecoilState(currentUserState);

    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
    return (
        <div className="border-b mt-2 mb-4 pb-4 border-gray-700 relative ">
            <button className="flex p-0.5 rounded w-full  items-start gap-2 transition-colors relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Y</span>
                </div>
                <div className="text-start">
                    <span className="font-bold text-sm block text-gray-100">{currentUser?.firstName}{' '}{currentUser?.lastName}</span>
                    <span className="block text-xs text-stone-500">{currentUser?.email}</span>
                </div>
                <FiChevronDown onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)} 
                className="absolute top-3 right-4 w-6 h-6 p-1 rounded cursor-pointer text-white hover-blacky" />
            </button>
            {isWorkspaceOpen ?<div className="flex flex-col bg-blacky-100 absolute z-1 w-48 rounded pt-6 pb-4 p-1 shadow shadow-gray-600">
                <div className="font-semibold text-center text-gray-200 pb-4">Workspaces</div>
             {workspaces.map((workspace: any, index: number) =>
                    <div key={workspace.id}
                        onClick={() => {
                            window.location.reload()
                        }}
                        className="p-2 hover:bg-gray-900 bg-black rounded text-gray-300  cursor-pointer flex gap-3 items-center border-b border-gray-600">
                            <div className="text-violet-500"><FiBriefcase /></div>
                         {workspace.name}</div>
                )}
            </div> : <></>}
        </div>

    )
}

export default AccountToggle
