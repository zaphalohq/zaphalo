// import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
import ChatsMain from "../components/Chats/Main"
import ChatsSide from "../components/Chats/Side"
import { ChatsProvider } from "../components/Context/ChatsContext"
// import Sidebar from "components/MainLayout/Sidebar/Sidebar"

const Chats = () => {
  return (
    <div className='bg-[#DDDCD1] '> 
      <div className='grid grid-cols-[350px_1fr] rounded-lg shadow-2xl sticky'>
      {/* <Sidebar /> */}
      <ChatsProvider>
        <ChatsSide />
        <ChatsMain />
        </ChatsProvider>
      </div>
    </div>
  )
}

export default Chats
