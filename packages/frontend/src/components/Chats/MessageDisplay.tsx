import { useContext, useEffect, useRef, useState } from "react"
import { useWebSocket } from "./Websocket_hooks/WebSocket";
import { useMutation, useQuery } from "@apollo/client";
import { findDefaultSelectedInstants, findMsgByChannelId, MakeUnseenMsgSeen } from "@src/generated/graphql";
import { ChatsContext } from "@components/Context/ChatsContext"
import { VITE_BACKEND_URL } from "@src/config";
import { FiDownload } from "react-icons/fi";

const MessageDisplay = () => {
  const [selectedPhoneNo, setSelectedPhoneNo] = useState<number | null>(null);
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
    messageType: '',
    attachment: {
      originalname: ''
    }
  }])

  const { data: selectedInstantsData, loading: selectedInstantsLoading } = useQuery(findDefaultSelectedInstants);
  useEffect(() => {
    if (!selectedInstantsLoading && selectedInstantsData) {
      setSelectedPhoneNo(Number(selectedInstantsData.findDefaultSelectedInstants.phoneNumberId))
    }
  }, [selectedInstantsData, selectedInstantsLoading])

  const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
    variables: { channelId: chatsDetails?.channelId },
    skip: !chatsDetails.channelId,
  })

  const FetchMessage = async () => {
    // if (chatsDetails.channelId !== '') {
      if (data?.findMsgByChannelId) {
        setAllMessages(data.findMsgByChannelId);
      } else {
        setAllMessages([]);
      }

      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    // } else {
    //   setAllMessages([{
    //     textMessage: '',
    //     sender: {
    //       id: '',
    //       phoneNo: ''
    //     },
    //     createdAt: '',
    //     attachmentUrl: '',
    //     messageType: '',
    //     attachment: {
    //       originalname: ''
    //     }
    //   }])
    // }
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
        messageType: '',
        attachment: {
          originalname: ''
        }
      }])
  }, [chatsDetails.channelId])


  const { messages }: any = useWebSocket()

  useEffect(() => {
    setAllMessages((prev) => [
      ...prev,
      ...myCurrentMessage
    ])
  }, [myCurrentMessage])

  const { newMessage, setNewMessage }: any = useContext(ChatsContext)
  // const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;

  const [makeUnseenMsgSeen, { data: makeSeenMsgUnseenData }] = useMutation(MakeUnseenMsgSeen);


  useEffect(() => {
    if (!newMessage) return
    console.log(newMessage,'.....................newMessage');
    
    if (newMessage != undefined) {
      const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
      const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);
      if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") {
        const newMessages = currentChannel.messageData.map((message: any) => ({
          textMessage: message.textMessage,
          messageType: message.messageType,
          attachmentUrl: message.attachmentUrl,
          attachment: {
            originalname: message.originalname
          },
          sender: {
            id: "",
            phoneNo: currentChannel.phoneNo,
          },
        }));
        setAllMessages((prev) => [...prev, ...newMessages]);
        newMessage.splice(currentChannelIndex, 1);
        setNewMessage(newMessage)

        if (currentChannel.messagesId) {
          makeUnseenMsgSeen({
            variables: { messageId: currentChannel?.messagesId || '' },
          })
        }
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
    <div className="flex-1 overflow-y-auto p-6" id="chat-scroll">
      <div ref={messagesContainerRef} className="max-w-7xl mx-auto">
        {allMessages.map((message, index) =>
          <div key={index} className="relative z-10 p-4">
            {Number(message.sender.phoneNo) != selectedPhoneNo ? (
              <div className="flex justify-start mb-4">
                {message.messageType === 'text' && <div className="bg-white border rounded-br-2xl rounded-tl-xl rounded-tr-2xl p-3 max-w-md shadow-sm">
                  <div className="whitespace-pre-wrap">{message.textMessage}</div>
                  {message.textMessage && (
                    <div className="text-xs mt-1 text-gray-400 text-right">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  )}
                </div>}
                {message.messageType === 'document' && message.attachment &&
                  <div className="bg-blue-500/30 rounded p-4 max-w-[70%] md:max-w-[40%]">
                    <div className="flex items-center gap-4">
                      <div>{`${message.attachment.originalname}`}</div>
                      <a
                        href={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                        download={message.attachment.originalname}
                        className="p-2 bg-blue-300 hover:bg-blue-400 cursor-pointer rounded"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiDownload />
                      </a>
                    </div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
                {message.messageType === 'image' && message.attachment &&
                  <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                    <img
                      src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                      alt="Media content"
                      className="object-contain border-none"
                    />
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
                {message.messageType === 'video' && message.attachment &&
                  <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                    <video
                      controls
                      className="max-h-[300px] object-contain rounded"
                      src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                    ></video>
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
                {message.messageType === 'audio' && message.attachment &&
                  <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                    <audio 
                      controls
                      src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                      ></audio>
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
              </div>
            ) : (
              <div className="flex justify-end rounded text-lg">
                {message.messageType === 'text' &&
                  <div className="bg-green-600 text-white rounded-bl-2xl rounded-tl-2xl rounded-tr-xl p-3 max-w-md shadow-sm">
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-green-100  text-right">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>}
                {message.messageType === 'document' && message.attachment &&
                  <div className="bg-blue-500/30 rounded p-4 max-w-[70%] md:max-w-[40%]">
                    <div className="flex items-center gap-4">
                      <div>{`${message.attachment.originalname}`}</div>
                      <a
                        href={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                        download={message.attachment.originalname}
                        className="p-2 bg-blue-300 hover:bg-blue-400 cursor-pointer rounded"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiDownload />
                      </a>
                    </div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
                {message.messageType === 'image' && message.attachment &&
                  <div className="bg-[#dbdff1] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                    <img
                      src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                      alt="Media content"
                      className="object-contain border-none"
                    />
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
                {message.messageType === 'video' && message.attachment &&
                  <div className="bg-[#dbdff1] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                    <video
                      controls
                      className="max-h-[300px] object-contain rounded"
                      src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                    ></video>
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
                {message.messageType === 'audio' && message.attachment &&
                  <div className="bg-[#dbdff1] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                    <audio 
                      controls
                      src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                      ></audio>
                    <div className="break-words">{message.textMessage}</div>
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  </div>
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageDisplay