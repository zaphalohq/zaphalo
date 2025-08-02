import { FiGrid, FiLink, FiSettings, FiUsers } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import Logout from '@components/Auth/Logout'
import SidebarElement from './SidebarElements'
import AccountToggle from '@components/UI/AccountToggle'

const MiniSidebar = ({isToggleActivated, HandleToggleButton} : any) => {
  return (
    <div className={`${isToggleActivated ? '' : 'hidden md:block' } overflow-y-scroll sticky top-4 h-[calc(100vh-32px-40px)]`}>
    <AccountToggle />     
    <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiGrid}  to='/dashboard' title={"Dashboard"}/>
    <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiSettings}  to='/settings' title={"Settings"}/>
    <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers}  to='/teams' title={"Teams"}/>
    <SidebarElement HandleToggleButton={HandleToggleButton} Icon={IoChatbubbleEllipsesOutline}  to='/chats' title={"Chats"}/>
    <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLink}  to='/integrations' title={"Integrations"}/>
    <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLink}  to='/whatsapp-account' title={"WhatsApp Accounts"}/>
    <div className='absolute left-3 bottom-3 w-[90%]'>    
      <Logout />
    </div>
    </div>
  )
}

export default MiniSidebar
