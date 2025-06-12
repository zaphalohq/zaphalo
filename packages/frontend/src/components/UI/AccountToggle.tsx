import { useGetCurrentUserLazyQuery } from "@src/generated/graphql";
import { getItem } from "@utils/localStorage"
import { useEffect, useState } from "react"
import { FiBriefcase, FiChevronDown, FiChevronRight, FiChevronsDown } from "react-icons/fi"
import {
  useRecoilState,
} from 'recoil';

import { workspacesState } from 'src/modules/auth/states/workspaces';


const AccountToggle = () => {

  const [getCurrentUser] = useGetCurrentUserLazyQuery();

useEffect(() => {
    const getCurrentUser1 = async () => {
    const currentUserResult = await getCurrentUser({
      fetchPolicy: 'network-only',
    });

    console.log(currentUserResult,"currentUserResultcurrentUserResultcurrentUserResultcurrentUserResultcurrentUserResultcurrentUserResult");
    
}
getCurrentUser1()
},[getCurrentUser])
    
    const user = getItem('userDetails')
    const [workspaces, setWorkspacesState]= useRecoilState(workspacesState);
    const workspaceIds = getItem('workspaceIds')
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
    return (
        <div className="border-b mt-2 mb-4 pb-4 border-gray-700 relative ">
            <button className="flex p-0.5 rounded w-full  items-start gap-2 transition-colors relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Y</span>
                </div>
                <div className="text-start">
                    <span className="font-bold text-sm block text-gray-100">{user?.name}</span>
                    <span className="block text-xs text-stone-500">{user?.email}</span>
                </div>
                <FiChevronDown onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)} className="absolute top-3 right-4 w-6 h-6 p-1 rounded cursor-pointer hover:bg-stone-200" />
            </button>
            {isWorkspaceOpen ?<div className="flex flex-col gap-2 absolute z-1 w-48 rounded bg-white p-2 pt-6 border border-gray-200">
                <div className="font-semibold text-center">Workspaces</div>
                {JSON.stringify(workspaces)}
                {/* {workspaces.map((workspace: string, index: number) =>

                    <div key={workspace.id}
                        onClick={() => {
                            window.location.reload()
                        }}
                        className="bg-gray-200 p-2 hover:bg-gray-300 cursor-pointer flex gap-3 items-center"><FiBriefcase />
                         {workspace.name}</div>
                )} */}
            </div> : <></>}
        </div>

    )
}

export default AccountToggle
