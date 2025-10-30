import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatsSide from "@components/Chats/Sidebar";
import ChatsMain from "@components/Chats/ChatLayout";
import UpdateChannelName from "@components/Chats/UpdateChannelName";
import { ChatsContext, ChatsProvider } from "@components/Context/ChatsContext";


const Chats = () => {
  const { isChatOpen }: any = useContext(ChatsContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (location.pathname == './chats') navigate(0)
  }, [])
  return (

     <div className="flex h-screen bg-gray-100">
        <ChatsSide />
        <ChatsMain />
        <UpdateChannelName />
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