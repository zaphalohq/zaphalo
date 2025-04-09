// import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
import ChatsMain from "../components/Chats/ChatLayout"
import ChatsSide from "../components/Chats/Sidebar"
import { ChatsProvider } from "../components/Context/ChatsContext"
import UpdateChannelName from "../components/Chats/UpdateChannelName"
// import Sidebar from "components/MainLayout/Sidebar/Sidebar"

const Chats = () => {
  return (
    <div className='bg-[#DDDCD1] border-stone-50 border-b-2'>
      <ChatsProvider>
        <div className='grid grid-cols-[300px_1fr] w-full  rounded-lg sticky'>
          <ChatsSide />
          <ChatsMain />
        </div>
        <UpdateChannelName />
      </ChatsProvider>
    </div>
  )
}

export default Chats
