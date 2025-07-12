import { useRecoilState } from 'recoil'
import SidebarElement from './SidebarElements'
import {
  FiGrid,
  FiSettings,
  FiUsers,
  FiLink,
  FiLayers,
  FiMap,
  FiRadio
} from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import Logout from '@components/Auth/Logout'
import AccountToggle from '@components/UI/AccountToggle'
import UserBottomToggle from '@src/components/UI/UserBottomToggle'
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState'

const Sidebar = ({ isToggleActivated, HandleToggleButton }: any) => {
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const workspaceId = currentUserWorkspace?.id;
  return (
    <div className='px-4'>
      <AccountToggle />
      <div className={`${isToggleActivated ? '' : 'hidden md:block'} overflow-y-scroll custom-scrollbox custom-scroll sticky top-4 h-[calc(100vh-230px)]`}>
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiGrid} to={`/w/${workspaceId}/dashboard`} title={"Dashboard"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={IoChatbubbleEllipsesOutline} to={`/w/${workspaceId}/chats`} title={"Chats"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiRadio} to={`/w/${workspaceId}/broadcast`} title={"Broadcast"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to={`/w/${workspaceId}/contacts`} title={"Contacts"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to={`/w/${workspaceId}/mailinglist`} title={"Mailing List"} />
        <SidebarElement
          HandleToggleButton={HandleToggleButton}
          Icon={FiSettings}
          title={"Settings"}
          subItems={[
            { title: "General", to: `/w/${workspaceId}/settings`, Icon: FiLink },
            { title: "Workspace", to: `/w/${workspaceId}/workspace`, Icon: FiLayers },
            { title: "Whatsapp Instants", to: `/w/${workspaceId}/whatsappinstants`, Icon: FiLink },
            { title: "Templates", to: `/w/${workspaceId}/template`, Icon: FiMap },
          ]}
        />
      </div>
      <Logout />
      <UserBottomToggle />

    </div>
  )
}

export default Sidebar