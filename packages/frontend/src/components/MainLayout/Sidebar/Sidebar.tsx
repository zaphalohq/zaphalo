// import SidebarElement from './SidebarElements'
// import { FiGrid, FiSettings, FiUsers, FiLink, FiPaperclip, FiMenu } from 'react-icons/fi'
// import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
// import AccountToggle from '../../UI/AccountToggle'
// import Logout from '../../Auth/Logout'

// const Sidebar = ({ isToggleActivated, HandleToggleButton }: any) => {
//   return (
//     <div>

//       <div className={`${isToggleActivated ? '' : 'hidden md:block'} overflow-y-scroll sticky top-4 h-[calc(100vh-32px-40px)]`}>
//         <AccountToggle />
//         <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiGrid} to='/dashboard' title={"Dashboard"} />
//         <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiSettings} to='/settings' title={"Settings"} />
//         <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to='/workspace' title={"Workspace"} />
//         <SidebarElement HandleToggleButton={HandleToggleButton} Icon={IoChatbubbleEllipsesOutline} to='/chats' title={"Chats"} />
//         <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLink} to='/integrations' title={"Integrations"} />
//         <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLink} to='/whatsappinstants' title={"WhatsappInstants"} />
//         <div className='absolute left-3 bottom-3 w-[90%]'>
//           <Logout />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Sidebar


import SidebarElement from './SidebarElements'
import { FiGrid, FiSettings, FiUsers, FiLink, FiMenu, FiLayers, FiMap } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import AccountToggle from '../../UI/AccountToggle'
import Logout from '../../Auth/Logout'

const Sidebar = ({ isToggleActivated, HandleToggleButton }: any) => {
  return (
    <div>
      <div className={`${isToggleActivated ? '' : 'hidden md:block'} overflow-y-scroll sticky top-4 h-[calc(100vh-32px-40px)]`}>
        <AccountToggle />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiGrid} to='/dashboard' title={"Dashboard"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiLayers} to='/workspace' title={"Workspace"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={IoChatbubbleEllipsesOutline} to='/chats' title={"Chats"} />
        <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to='/contacts' title={"Contacts"} />
        {/* <SidebarElement HandleToggleButton={HandleToggleButton} Icon={FiUsers} to='/templateform' title={"TemplateForm"} /> */}
        
        <SidebarElement 
          HandleToggleButton={HandleToggleButton} 
          Icon={FiSettings} 
          // to='/settings' 
          title={"Settings"} 
          subItems={[
            { title: "WhatsappInstants", to: "/whatsappinstants", Icon: FiLink },
            { title: "TemplateForm", to: "/templateform", Icon: FiMap }
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