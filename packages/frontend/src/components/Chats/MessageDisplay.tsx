import { useContext, useEffect, useRef, useState } from "react"
import { ChatsContext } from "@Context/ChatsContext"
import { getItem, setItem } from "@utils/localStorage";
import { useQuery } from "@apollo/client";
import { findMsgByChannelId } from "@pages/Mutation/Chats";
import { useWebSocket } from "./Websocket_hooks/WebSocket";

const MessageDisplay = () => {
  const senderPhoneNo = import.meta.env.VITE_SENDER_PHONENO;
  const { myCurrentMessage }: any = useContext(ChatsContext)
  const { chatsDetails }: any = useContext(ChatsContext)
  const [allMessages, setAllMessages] = useState([{
    textMessage: '',
    sender: {
      id: '',
      phoneNo: ''
    },
    createdAt: '',
    attachmentUrl: '',
  }])

  //-----------------Mutation of finding all messages of current channel-------------
  const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
    variables: { channelId: chatsDetails?.channelId },
    skip: chatsDetails.channelId == '',
  })


  //--------------------Fetch messages-------------------------------
  const FetchMessage = async () => {
    if (chatsDetails.channelId !== '') {
      // await ref  etch(); // Ensure latest data is fetched

      if (data?.findMsgByChannelId) {
        setAllMessages(data.findMsgByChannelId);
      } else {
        console.log('No messages found or still loading.');
        setAllMessages([]);
      }

      // Auto-scroll to latest message
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    } else {
      setAllMessages([{
        textMessage: '',
        sender: {
          id: '',
          phoneNo: ''
        },
        createdAt: '',
        attachmentUrl: '',
      }])
    }
  };

  //----------Trigger fetching messages when data is updated---------------------
  useEffect(() => {
    // console.log(chatsDetails,"thisis form messages ..........................");

    if (!loading && data) {
      FetchMessage();
    }
  }, [data, loading, chatsDetails]);

  useEffect(() => {
    if (chatsDetails.channelId == '')
      setAllMessages([{
        textMessage: '',
        sender: {
          id: '',
          phoneNo: ''
        },
        createdAt: '',
        attachmentUrl: '',
      }])
  }, [chatsDetails.channelId])


  const { messages }: any = useWebSocket()

  //---------------when i messages it push my message to array and display---------
  useEffect(() => {
    setAllMessages((prev) => [
      ...prev,
      {
        textMessage: myCurrentMessage.message,
        sender: {
          id: '',
          phoneNo: senderPhoneNo
        },
        createdAt: '',
        attachmentUrl: myCurrentMessage.attachmentUrl,
      }])
  }, [myCurrentMessage])

  //---------------When new message comes from websocket it handles it------------------- 
  const { newMessage, setNewMessage }: any = useContext(ChatsContext)
  useEffect(() => {
    console.log(JSON.stringify(newMessage), ".........................new mdmdmd..............");
    if (!newMessage) return
    if (newMessage != undefined) {
      const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
      const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);
      // console.log(currentChannel?.message[0].message,"currentChannelcurrentChannelcurrentChannelcurrentChannelcurrentChannel");


      if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") {
        const newMessages = currentChannel?.textMessage.map((message: any) => ({
          textMessage: message.textMessage,
          sender: {
            id: "",
            phoneNo: currentChannel.phoneNo,
          },
        }));
        setAllMessages((prev) => [...prev, ...newMessages]); // Add all at once

        // Remove the channel from newMessage and update storage
        newMessage.splice(currentChannelIndex, 1);

        setNewMessage(newMessage)
        setItem("messages", newMessage); // Save the updated array
      }
    }
  }, [newMessage]);

  //-----------------It handle the the date displayed with message---------
  const HandleCurrentDate = (createdAt: any) => {
    const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return currentDate
  }

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <div className="relative h-[72.8vh]">
      {/* opacity of image */}
      {/* <div style={{ backgroundAttachment: "fixed" }} className="absolute inset-0 overflow-y-scroll bg-whatsappImg bg-gray-500 opacity-15 z-0 "></div> */}
      <div ref={messagesContainerRef} className="relative z-10 h-full overflow-y-scroll p-4">
        {/* <button onClick={BUTTON}>BUTTON</button> */}
        {allMessages.map((message, index) =>
          <div key={index} className="relative z-10 p-4">
            {message.sender.phoneNo != senderPhoneNo ? (
              <div className="text-stone-900 flex justify-start text-lg ">
                <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                  <div className="break-words">{message.textMessage}</div>
                  {message.textMessage ? (
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex justify-end rounded text-lg">
                <div className=" bg-[#dbdff1] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[30%]">
                  {message.attachmentUrl ? <div>
                    {/\.(png|jpe?g|gif|webp|svg)$/i.test(message.attachmentUrl) ? (
                      <img
                        src={message.attachmentUrl}
                        alt="Media content"
                        className="w-[200px] h-[200px] object-contain border-none"
                      />
                    ) :
                      (<iframe
                        src={message.attachmentUrl}
                        width="200"
                        height="200"
                        className="border-none object-contain"
                      />)}
                    <div onClick={() => window.open(message.attachmentUrl)}
                      className="hover:cursor-pointer text-blue-700" >{message.attachmentUrl.split('-').pop()}
                    </div>
                  </div>
                    : <></>}
                  <div className="break-words">{message.textMessage}</div>
                  {message.textMessage ? (
                    <div className="text-xs text-gray-500 self-end">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default MessageDisplay