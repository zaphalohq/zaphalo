import { useRecoilState } from 'recoil'
import SidebarElement from './SidebarElements'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import Logout from '@components/Auth/Logout'
import AccountToggle from '@components/UI/AccountToggle'
import UserBottomToggle from '@src/components/UI/UserBottomToggle'
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState'
import {
  Home,
  MessageCircle,
  Users,
  Megaphone,
  Settings,
  Wrench,
  Plug2,
  BriefcaseBusiness,
  UserRoundPen,
  LayoutPanelTop
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const workspaceId = currentUserWorkspace?.id;

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, key: 'dashboard' },
    { name: 'Chats', icon: <MessageCircle size={20} />, key: 'chats' },
    { name: 'Contacts', icon: <Users size={20} />, key: 'contacts' },
    { name: 'Broadcasts', icon: <Megaphone size={20} />, key: 'Broadcast' },
    { name: 'Settings', icon: <Settings size={20} />, key: 'settings', subItems: [
      { title: "General", to: `/w/${workspaceId}/settings`, Icon: <Wrench size={16}/> },
      { title: "Workspace", to: `/w/${workspaceId}/workspace`, Icon: <BriefcaseBusiness size={16}/> },
      { title: "WhatsApp Accounts", to: `/w/${workspaceId}/whatsapp-account`, Icon: <UserRoundPen size={16}/> },
      { title: "Templates", to: `/w/${workspaceId}/template`, Icon: <LayoutPanelTop size={16}/> }
    ]}
  ];

  return (
    <div className="flex flex-col bg-gray-900 text-white w-64 min-h-screen p-4">
      <AccountToggle />
      <div className={`${activeTab ? '' : 'hidden md:block'} overflow-y-scroll custom-scrollbox custom-scroll sticky top-4 h-[calc(100vh-300px)]`}>
        <nav className="flex flex-col gap-2">
          {menuItems.map(item => (
            <SidebarElement HandleToggleButton={setActiveTab} Icon={item.icon} to={`/w/${workspaceId}/${item.key}`} title={item.name} subItems={item.subItems}/>
            ))}
        </nav>
      </div>
      <Logout />
      <UserBottomToggle />
    </div>
  );
}