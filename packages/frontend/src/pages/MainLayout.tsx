import { useRecoilState } from "recoil"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
import WorkspaceSetup from "@src/components/UI/WorkspaceSetup"
import { currentUserWorkspaceState } from "@src/modules/auth/states/currentUserWorkspaceState"

const MainLayout = () => {
  const [isToggleActivated, setIsToggleActivated] = useState(false)
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

  const HandleToggleButton = () => {
    setIsToggleActivated(!isToggleActivated)
  }

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (currentUserWorkspace !== null) {
      setIsLoaded(true);
    }
  }, [currentUserWorkspace]);

  return (
    <div className="grid md:grid-cols-[260px_1fr] min-h-screen w-full bg-blacky-900 overflow-hidden ">
      <Sidebar HandleToggleButton={HandleToggleButton} isToggleActivated={isToggleActivated} />
      {currentUserWorkspace && !currentUserWorkspace?.isWorkspaceSetup && <WorkspaceSetup />}
      <div className="w-full overflow-hidden">
        <div className={`${isToggleActivated ? 'hidden md:block' : 'md:block'} md:block w-full h-full`}>
          <div className="w-full h-full overflow-hidden bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
