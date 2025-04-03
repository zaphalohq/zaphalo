import { useContext, useEffect, useRef, useState } from "react"
import { ChatsContext } from "../Context/ChatsContext"
import axios from 'axios'
import { useWebSocket } from "./hooks/WebSocket";
import { getItem, setItem } from "../utils/localStorage";
import { useQuery } from "@apollo/client";
import { findMsgByChannelId } from "../../pages/Mutation/Chats";

const MessageDisplay = () => {
  const senderPhoneNo = import.meta.env.VITE_SENDER_PHONENO;
  const { myCurrentMessage } : any = useContext(ChatsContext)
  const { chatsDetails }: any = useContext(ChatsContext)
  const [allMessages, setAllMessages] = useState([{
    message: '',
    sender: {
      id: '',
      phoneNo: ''
    },
    createdAt: ''
  }])

  const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
    variables: { channelId: chatsDetails?.channelId },
    skip: chatsDetails.channelId == null,
  })


  // const FetchMessage = async () => {
  //   if (chatsDetails.channelId !== '') {
  //   //   const response = await axios.get("http://localhost:3000/webhook/sendMsg1",
  //   //     {
  //   //       headers: {
  //   //         Authorization: import.meta.env.VITE_TOKEN
  //   //       },
  //   //       params: {
  //   //         channelId: chatsDetails.channelId
  //   //       },
  //   //     })

  //   console.log(data.findMsgByChannelId,'this is messages');

  //     setAllMessages(data.findMsgByChannelId)
  //     // if (makeScroll.current) makeScroll.current.scrollIntoView({ behavior: 'smooth' })
  //   } else {
  //     setAllMessages([{
  //       message: '',
  //       sender: {
  //         id: '',
  //         phoneNo: ''
  //       },
  //       createdAt : ''
  //     }])
  //   }
  // }


  const FetchMessage = async () => {
    if (chatsDetails.channelId !== '') {
      await refetch(); // Ensure latest data is fetched

      if (data?.findMsgByChannelId) {
        setAllMessages(data.findMsgByChannelId);
      } else {
        console.log('No messages found or still loading.');
        setAllMessages([]);
      }

      // Auto-scroll to latest message
      if (makeScroll.current)
        makeScroll.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      setAllMessages([{
        message: '',
        sender: {
          id: '',
          phoneNo: ''
        },
        createdAt: ''
      }])
    }
  };

  // Trigger fetching messages when data is updated
  useEffect(() => {
    if (!loading && data) {
      FetchMessage();
    }
  }, [data, loading]);

  useEffect(() => {
    if (chatsDetails.channelId == '')
      setAllMessages([{
        message: '',
        sender: {
          id: '',
          phoneNo: ''
        },
        createdAt: ''
      }])
  }, [chatsDetails.channelId])

  const makeScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (makeScroll.current) makeScroll.current.scrollIntoView({ behavior: 'instant' })
  }, [allMessages]);

  const { messages }: any = useWebSocket()

  useEffect(() => {
    setAllMessages((prev) => [
      ...prev,
      {
        message: myCurrentMessage,
        sender: {
          id: '',
          phoneNo: senderPhoneNo
        },
        createdAt: ''
      }])
  }, [myCurrentMessage])

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
  const { newMessage, setNewMessage }: any = useContext(ChatsContext)

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
      console.log(newMessage, "t...........................................newmess");

      setNewMessage(newMessage)
      setItem("messages", newMessage); // Save the updated array
    }
  }, [newMessage]);


  const HandleCurrentDate = (createdAt: any) => {
    const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return currentDate
  }
  return (
    <div className="relative h-[75vh]">
      {/* opacity of image */}
      <div style={{ backgroundAttachment: "fixed" }} className="absolute inset-0 overflow-y-scroll bg-whatsappImg bg-gray-500 opacity-15 z-0 "></div>
      <div className="relative z-10 h-full overflow-y-scroll p-4">
        {/* <button onClick={BUTTON}>BUTTON</button> */}
        {allMessages.map((message, index) =>
          <div key={index} className="relative z-10 p-4">
            {message.sender.phoneNo != senderPhoneNo ? (
              <div className="text-stone-900 flex justify-start text-lg ">
                <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[40%]">
                  <div className="break-words">{message.message}</div>
                  {message.message ? (
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex justify-end rounded text-lg">
                <div className=" bg-[#dbf8c6] p-2 rounded-lg flex flex-col gap-1 max-w-[40%]">
                  <div className="break-words">{message.message}</div>
                  {message.message ? (
                    <div className="text-xs text-gray-500 self-end">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  ) : null}
                </div>
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
