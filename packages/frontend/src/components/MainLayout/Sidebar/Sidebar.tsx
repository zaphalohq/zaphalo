
import SidebarElement from './SidebarElements'
import { FiGrid, FiSettings, FiUsers, FiLink, FiMenu, FiLayers, FiMap, FiRadio } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import AccountToggle from '@UI/AccountToggle'
import Logout from '../../Auth/Logout'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentWorkspaceIdState } from '@src/modules/auth/states/currentWorkspaceIdState'
import { useEffect } from 'react'
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState'
import UserBottomToggle from '@src/components/UI/UserBottomToggle'

const Sidebar = ({ isToggleActivated, HandleToggleButton }: any) => {
  const [currentUserWorkspace, setCurrentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

  const workspaceId = currentUserWorkspace?.id;
  useEffect(() => {
    console.log(currentUserWorkspace, ".............workspaceId");

  }, [currentUserWorkspace])
  return (
    <div className='px-4'>
      <AccountToggle />
      <div className={`${isToggleActivated ? '' : 'hidden md:block'} overflow-y-scroll custom-scrollbox custom-scroll sticky top-4 h-[calc(100vh-230px)]`}>
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiGrid} to={`/w/${workspaceId}/dashboard`} title={"Dashboard"} />
        {/* <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLayers} to={`/w/${workspaceId}/workspace`} title={"Workspace"} /> */}
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={IoChatbubbleEllipsesOutline} to={`/w/${workspaceId}/chats`} title={"Chats"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiRadio} to={`/w/${workspaceId}/broadcast`} title={"Broadcast"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to={`/w/${workspaceId}/contacts`} title={"Contacts"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to={`/w/${workspaceId}/mailinglist`} title={"Mailing List"} />
        <SidebarElement
          HandleToggleButton={HandleToggleButton}
          Icon={FiSettings}
          // to='/settings' 
          title={"Settings"}
          subItems={[
            { title: "Whatsapp Instants", to: `/w/${workspaceId}/whatsappinstants`, Icon: FiLink },
            { title: "Template", to: `/w/${workspaceId}/template`, Icon: FiMap },
            { title: "Workspace", to: `/w/${workspaceId}/workspace`, Icon: FiLayers }
          ]}
        />
      </div>
      <Logout />
      <UserBottomToggle />

    </div>
  )
}

export default Sidebar