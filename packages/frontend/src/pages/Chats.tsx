// // import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
// import ChatsMain from "../components/Chats/ChatLayout"
// import ChatsSide from "../components/Chats/Sidebar"
// import { ChatsContext, ChatsProvider } from "../components/Context/ChatsContext"
// import UpdateChannelName from "../components/Chats/UpdateChannelName"
// import { useContext, useState } from "react"
// import { Bold } from "lucide-react"
// // import Sidebar from "components/MainLayout/Sidebar/Sidebar"

// const Chats = () => {
//   const { isChatOpen }: any = useContext(ChatsContext);
//   return (
//     <div className='bg-[#DDDCD1] border-stone-50 border-b-2 md:mt-0 mt-4 h-[calc(100vh-120px)]'>
//         <div className='grid md:grid-cols-[300px_1fr] w-full  rounded-lg'>
//           <div className={`${isChatOpen ? "hidden" : "block"} md:block`}><ChatsSide /></div>
//          <div className={`${isChatOpen ? "block" : "hidden"} md:block`}><ChatsMain /></div>
//         </div>
//         <UpdateChannelName />
//     </div>
//   )
// }

// const ChatsLayout = () => {
//   return(
//     <ChatsProvider>
//     <Chats />
//     </ChatsProvider>
//   )
// }

// export default ChatsLayout




// import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
import ChatsMain from "../components/Chats/ChatLayout";
import ChatsSide from "../components/Chats/Sidebar";
import { ChatsContext, ChatsProvider } from "../components/Context/ChatsContext";
import UpdateChannelName from "../components/Chats/UpdateChannelName";
import { useContext, useEffect } from "react";
import { Bold } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
// import Sidebar from "components/MainLayout/Sidebar/Sidebar"

const Chats = () => {
  const { isChatOpen }: any = useContext(ChatsContext);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
console.log(location.pathname,"..........................................................................................");
if(location.pathname == './chats') navigate(0)

  },[]) 
  return (
    <div className="bg-[#DDDCD1] border-stone-50 border-b-2 md:mt-0 mt-4 flex flex-col">
      <div className="grid md:grid-cols-[300px_1fr] w-full h-full mx-auto rounded-lg flex-1">
        <div className={`${isChatOpen ? "hidden" : "block"} md:block bg-gray-50  min-w-full max-w-ful`}>
          <ChatsSide />
        </div>
        <div className={`${isChatOpen ? "block" : "hidden"} md:block min-w-full max-w-full`}>
          <ChatsMain />
        </div>
      </div>
      <UpdateChannelName />
      {/* <ChannelDetails /> */}
    </div>
  );
};

const ChatsLayout = () => {
  return (
    <ChatsProvider>
      <Chats />
    </ChatsProvider>
  );
};

export default ChatsLayout;