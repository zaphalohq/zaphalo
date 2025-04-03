// import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
import ChatsMain from "../components/Chats/Main"
import ChatsSide from "../components/Chats/Side"
import { ChatsProvider } from "../components/Context/ChatsContext"
// import Sidebar from "components/MainLayout/Sidebar/Sidebar"

const Chats = () => {
  return (
    <div className='bg-[#DDDCD1] border-stone-50 border-b-2'> 
      <div className='grid grid-cols-[300px_1fr] w-full  rounded-lg sticky'>
      <ChatsProvider>
        <ChatsSide />
        <ChatsMain />
        </ChatsProvider>
      </div>
    </div>
  )
}

export default Chats
