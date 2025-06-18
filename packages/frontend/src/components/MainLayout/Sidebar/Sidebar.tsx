
import SidebarElement from './SidebarElements'
import { FiGrid, FiSettings, FiUsers, FiLink, FiMenu, FiLayers, FiMap, FiRadio } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import AccountToggle from '@UI/AccountToggle'
import Logout from '../../Auth/Logout'

const Sidebar = ({ isToggleActivated, HandleToggleButton }: any) => {
  return (
    <div className='px-4'>
        <AccountToggle />
      <div className={`${isToggleActivated ? '' : 'hidden md:block'} overflow-y-scroll custom-scrollbox custom-scroll sticky top-4 h-[calc(100vh-150px)]`}>
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiGrid} to='/dashboard' title={"Dashboard"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLayers} to='/workspace' title={"Workspace"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={IoChatbubbleEllipsesOutline} to='/chats' title={"Chats"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiRadio} to='/broadcast' title={"Broadcast"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to='/contacts' title={"Contacts"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to='/mailinglist' title={"Mailing List"} />
        <SidebarElement 
          HandleToggleButton={HandleToggleButton} 
          Icon={FiSettings} 
          // to='/settings' 
          title={"Settings"} 
          subItems={[
            { title: "Whatsapp Instants", to: "/whatsappinstants", Icon: FiLink },
            { title: "Template", to: "/template", Icon: FiMap }
          ]}
        />
        <div className='absolute left-3 bottom-3 w-[90%]'>
          <Logout />
        </div>
      </div>
    </div>
  )
}

export default Sidebar