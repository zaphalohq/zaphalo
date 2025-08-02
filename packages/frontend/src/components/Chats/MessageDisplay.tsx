import { useContext, useEffect, useRef, useState } from "react"
import { useWebSocket } from "./Websocket_hooks/WebSocket";
import { useQuery } from "@apollo/client";
import { findDefaultSelectedInstants, findMsgByChannelId } from "@src/generated/graphql";
import { ChatsContext } from "@components/Context/ChatsContext"

const MessageDisplay = () => {
  const [selectedPhoneNo, setSelectedPhoneNo ] = useState<number | null>(null);
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

  const { data: selectedInstantsData, loading: selectedInstantsLoading } = useQuery(findDefaultSelectedInstants);
  useEffect(() => {
    if(!selectedInstantsLoading && selectedInstantsData){
      setSelectedPhoneNo(Number(selectedInstantsData.findDefaultSelectedInstants.phoneNumberId))
    }
  },[selectedInstantsData,selectedInstantsLoading])

  const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
    variables: { channelId: chatsDetails?.channelId },
    skip: !chatsDetails.channelId,
  })

  const FetchMessage = async () => {
    if (chatsDetails.channelId !== '') {
      if (data?.findMsgByChannelId) {
        setAllMessages(data.findMsgByChannelId);
      } else {
        setAllMessages([]);
      }

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

  useEffect(() => {
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

  useEffect(() => {
    setAllMessages((prev) => [
      ...prev,
      {
        textMessage: myCurrentMessage.message,
        sender: {
          id: '',
          phoneNo: JSON.stringify(selectedPhoneNo)
        },
        createdAt: '',
        attachmentUrl: myCurrentMessage.attachmentUrl,
      }])
  }, [myCurrentMessage])

  const { newMessage, setNewMessage }: any = useContext(ChatsContext)
  useEffect(() => {
    if (!newMessage) return
    if (newMessage != undefined) {
      const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
      const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);
      if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") {
        const newMessages = currentChannel?.textMessage.map((message: any) => ({
          textMessage: message.textMessage,
          sender: {
            id: "",
            phoneNo: currentChannel.phoneNo,
          },
        }));
        setAllMessages((prev) => [...prev, ...newMessages]);
        newMessage.splice(currentChannelIndex, 1);
        setNewMessage(newMessage)
        localStorage.setItem("messages", newMessage);
      }
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

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <div className="relative h-[72.8vh]">
      <div ref={messagesContainerRef} className="relative z-10 h-full overflow-y-scroll p-4">
        {allMessages.map((message, index) =>
          <div key={index} className="relative z-10 p-4">
            {Number(message.sender.phoneNo) != selectedPhoneNo ? (
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