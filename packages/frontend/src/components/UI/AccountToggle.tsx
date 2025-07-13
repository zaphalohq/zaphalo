import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ChevronDown, Briefcase } from "lucide-react"
import {
  useRecoilState,
} from 'recoil';
import { workspacesState } from '@src/modules/auth/states/workspaces';
import { currentUserWorkspaceState } from "@src/modules/auth/states/currentUserWorkspaceState";
import { VITE_BACKEND_URL } from '@src/config';

const AccountToggle = () => {
  const [workspaces] = useRecoilState(workspacesState);
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const navigate = useNavigate()
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
  return (
    <div className="border-b mt-2 mb-4 pb-4 border-gray-700 relative">
      <div className="flex p-0.5 w-full items-start gap-2 relative hover:bg-gray-800/50 rounded-xl">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              <img src={`${VITE_BACKEND_URL}/files/${currentUserWorkspace?.profileImg}`}/>
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>

        <div className="text-start flex-1">
          <span className="font-bold text-sm block text-gray-100 truncate w-32">
            {currentUserWorkspace?.name}
          </span>
          <span className="block text-xs text-stone-500">current workspace</span>
        </div>

        <ChevronDown
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className={`absolute top-3 right-4 w-5 h-5 rounded cursor-pointer text-white hover:text-gray-300 transition-all duration-200 ${isWorkspaceOpen ? 'rotate-180' : ''
            }`}
        />
      </div>

      {isWorkspaceOpen && (
        <div className="flex flex-col bg-gray-800 absolute z-50 w-full rounded-xl mt-2 shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-center text-gray-200">Workspaces</span>
            </div>
          </div>

          <div className="py-2 max-h-64 overflow-y-auto">
            {workspaces.map((workspace: any, index: number) => (
              <div
                key={workspace.id}
                onClick={() => {
                  const path = window.location.pathname;
                  const segments = path.split('/');
                  if (segments.length > 2 && segments[1] === 'w') {
                    segments[2] = workspace.id
                  }
                  navigate(segments.join('/'))
                  window.location.reload()
                }}
                className={`p-3 hover:bg-gray-700 cursor-pointer flex gap-3 items-center transition-colors duration-150 ${currentUserWorkspace?.id === workspace.id
                    ? 'bg-blue-900/30 text-blue-300 border-r-2 border-blue-500'
                    : 'text-gray-300'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentUserWorkspace?.id === workspace.id
                    ? 'bg-blue-900/50'
                    : 'bg-gray-700'
                  }`}>
                  <Briefcase className={`w-4 h-4 ${currentUserWorkspace?.id === workspace.id
                      ? 'text-blue-400'
                      : 'text-violet-500'
                    }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm truncate w-[130px]">{workspace.name}</div>
                  {currentUserWorkspace?.id === workspace.id && (
                    <div className="text-xs text-blue-400 mt-0.5">
                      Current workspace
                    </div>
                  )}
                </div>
                {currentUserWorkspace?.id === workspace.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {isWorkspaceOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setIsWorkspaceOpen(false)}
        />
      )}
    </div>
  )
}

export default AccountToggle