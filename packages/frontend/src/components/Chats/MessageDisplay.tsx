import { useContext, useEffect, useRef, useState } from "react"
import { ChatsContext } from "../Context/ChatsContext"
import axios from 'axios'
import { useWebSocket } from "./hooks/WebSocket";
import { getItem, setItem } from "../utils/localStorage";

const MessageDisplay = ({ myMessage } : any) => {
  const senderPhoneNo = import.meta.env.VITE_SENDER_PHONENO;
  const { chatsDetails }: any = useContext(ChatsContext)
  const [allMessages, setAllMessages] = useState([{
    message: '',
    sender: {
      id: '',
      phoneNo: ''
    }
  }])
  const FetchMessage = async () => {
    if (chatsDetails.channelId !== '') {
      const response = await axios.get("http://localhost:3000/webhook/sendMsg1",
         {
        headers: {
          Authorization : import.meta.env.VITE_TOKEN
        },
        params: {
          channelId: chatsDetails.channelId
        },
      })
      setAllMessages(response.data)
      if(makeScroll.current) makeScroll.current.scrollIntoView({ behavior : 'smooth'})
    } else {
      setAllMessages([{
        message: '',
        sender: {
          id: '',
          phoneNo: ''
        }
      }])
    }
  }

  const makeScroll = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // console.log(chatsDetails.channelId, 'tjos os current');
    FetchMessage()
  }, [chatsDetails.channelId])
  
  useEffect(() => {
    if(makeScroll.current) makeScroll.current.scrollIntoView({ behavior : 'instant'})
  }, [allMessages]);

  const { messages } : any = useWebSocket()

  useEffect(() => {
    setAllMessages((prev) => [
      ...prev,
      {
      message: myMessage,
      sender: {
        id: '',
        phoneNo: senderPhoneNo
      }
    }])
  }, [myMessage])

  // useEffect(() => {
  //   const newMessage = getItem("messages")
  //   console.log(newMessage,"................this is from useeffect........................");
  //   const currentChannel = newMessage.find((message : any) => message.channelId == chatsDetails.channelId)
  //   const currentChannelIndex = newMessage.findIndex((message : any) => message.channelId == chatsDetails.channelId)
  //   console.log(currentChannel,"this is currene channel");
  //   if(currentChannel.channelId === chatsDetails.channelId){
  //     currentChannel.message.forEach((message : any) => {
  //       setAllMessages((prev) =>  [
  //         ...prev,
  //         {
  //           message: message,
  //           sender: {
  //             id: '',
  //             phoneNo: currentChannel.phoneNo
  //           }
  //         }
  //       ]) 
  //     }); 
  //     const removeCurrentChannel = newMessage.splice(currentChannelIndex,1)
  //     setItem("messages", removeCurrentChannel)
  //   }
    
  // },[getItem("messages")])
  const { newMessage,setNewMessage }: any = useContext(ChatsContext)

  useEffect(() => {
    const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId);
    const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);
    if (currentChannel) { // Check if channel exists
        // Build the new messages array once
        const newMessages = currentChannel.message.map((message: any) => ({
            message: message,
            sender: {
                id: "",
                phoneNo: currentChannel.phoneNo,
            },
        }));
        setAllMessages((prev) => [...prev, ...newMessages]); // Add all at once

        // Remove the channel from newMessage and update storage
        newMessage.splice(currentChannelIndex, 1);
        console.log(newMessage,"t...........................................newmess");
        
        setNewMessage(newMessage)
        setItem("messages", newMessage); // Save the updated array
    }
}, [newMessage]); 

  return (
    <div className="relative h-[76vh]">
      {/* opacity of image */}
      <div style={{ backgroundAttachment: "fixed" }} className="absolute inset-0 overflow-y-scroll bg-whatsappImg bg-gray-500 opacity-15 z-0 "></div>
      <div className="relative z-10 h-full overflow-y-scroll p-4">
        {/* <button onClick={BUTTON}>BUTTON</button> */}
        {allMessages.map((message, index) =>
          <div key={index} className="relative z-10 p-4">
            {message.sender.phoneNo !== senderPhoneNo ? (
              <div className="text-stone-900 flex justify-start text-lg ">
                <div className="bg-[#ffffff] p-2 rounded">{message.message}</div>
              </div>
            ) : (
              <div className="flex justify-end rounded text-lg">
                <div className="p-2 text-stone-900 bg-[#dbf8c6] rounded">{message.message}</div>
              </div>
            )}
          </div>
        )}
        {/* makeing is autoscrollable */}
        {JSON.stringify(messages)}
        <div ref={makeScroll}></div>
      </div>
    </div>
  )
}

export default MessageDisplay
