import { useQuery, useMutation, gql } from "@apollo/client";
import { useEffect, useRef, useState, useContext } from "react";
import { findDefaultSelectedInstants, ChannelMessage, MakeUnseenMsgSeen } from "@src/generated/graphql";
import { ChatsContext } from "@components/Context/ChatsContext"
import { VITE_BACKEND_URL } from '@src/config';
import { useWebSocket } from "./Websocket_hooks/WebSocket";

interface Message {
  id: string;
  text: string;
  sender: any;
  createdAt: string;
}

export default function MessageDisplay() {
  const LIMIT = 20;
  const [selectedPhoneNo, setSelectedPhoneNo] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const { chatsDetails, newMessage, setNewMessage, myCurrentMessage }: any = useContext(ChatsContext)
  const containerRef = useRef<HTMLDivElement>(null);


  const { data, loading, error, fetchMore } = useQuery(ChannelMessage, {
    variables: { channelId:  chatsDetails?.channelId, cursor: null, limit: LIMIT },
    fetchPolicy: "cache-and-network",
  });
  const { data: selectedInstantsData, loading: selectedInstantsLoading } = useQuery(findDefaultSelectedInstants);
  const [makeUnseenMsgSeen, { data: makeSeenMsgUnseenData }] = useMutation(MakeUnseenMsgSeen);

  const { socketMessages }: any = useWebSocket()

  // On first load
  useEffect(() => {
    if (data?.messages?.edges) {
      setMessages(data.messages.edges.slice()); // newest at bottom
      setCursor(data.messages.cursor);
      // scroll to bottom
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [data]);

  // Load older messages
  const loadMore = async () => {
    if (!cursor || loading) return;

    const el = containerRef.current;
    const prevHeight = el?.scrollHeight ?? 0;
    const prevTop = el?.scrollTop ?? 0;

    const res = await fetchMore({
      variables: { cursor, limit: LIMIT },
    });


    if (res.data?.messages?.edges) {

      setMessages(prev => {
        // Combine new and old messages
        const combined = [...prev, ...res.data.messages.edges.slice()];

        // Remove duplicates by ID
        const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());

        return unique;
      });
      setCursor(res.data.messages.cursor);

      requestAnimationFrame(() => {
        if (el) {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - prevHeight + prevTop;
        }
      });
    }
  };

  // Handle scroll
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop < 50 && !loading) {
      loadMore();
    }
  };

  const HandleCurrentDate = (createdAt: any) => {
    const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return currentDate
  }

  useEffect(() => {
    if (!selectedInstantsLoading && selectedInstantsData) {
      setSelectedPhoneNo(Number(selectedInstantsData.findDefaultSelectedInstants.phoneNumberId))
    }
  }, [selectedInstantsData, selectedInstantsLoading])

  useEffect(() => {
    if (chatsDetails.channelId == '')
      setAllMessages([{
        textMessage: '',
        createdAt: '',
        attachmentUrl: '',
        messageType: '',
        sender: '',
        attachment: {
          originalname: ''
        }
      }])
  }, [chatsDetails.channelId])

  useEffect(() => {
    setMessages(prev => [...myCurrentMessage, ...prev]);
  }, [myCurrentMessage])


  useEffect(() => {
    if (newMessage.length == 0) return
    
    if (newMessage.length > 0) {
      const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
      const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);
      if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") {
        const newMessages = currentChannel.messageData.map((message: any) => ({
          id: message.id,
          textMessage: message.textMessage,
          messageType: message.messageType,
          attachmentUrl: message.attachmentUrl,
          sender: message.sender,
          attachment: {
            originalname: message.originalname
          },
        }));

        setMessages(prev => {
        // Combine new and old messages
          const combined = [...newMessages.slice().reverse(), ...prev, ];

          // Remove duplicates by ID
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());

          return unique;
        });
        // setMessages((prev) => [...newMessages, ...prev]);
        // newMessage.splice(currentChannelIndex, 1);
        // setMessages(newMessage)

        if (currentChannel.messagesId) {
          makeUnseenMsgSeen({
            variables: { messageId: currentChannel?.messagesId || '' },
          })
        }
      }
    }
  }, [newMessage]);

  return (
    <div className="flex h-[calc(100vh-20%)] p-6 bg-[#efeae2]">
      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto flex flex-col-reverse p-3"
        onScroll={onScroll}
      >
        {loading && messages.length === 0 && (
          <div className="text-center text-xs text-gray-500 py-2">
            Loading messages…
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className="relative z-10 p-4">
            <div className={`flex mb-4 ${message.sender ? 'justify-start': 'justify-end'}`}>
              {message.messageType === 'text' &&
                <div className={`border rounded-br-2xl rounded-tl-xl rounded-tr-2xl p-3 max-w-md shadow-sm ${message.sender ? 'bg-white ': 'bg-green-600 text-white'}`}>
                  <div className="whitespace-pre-wrap">{message.textMessage}</div>
                  {message.textMessage && (
                    <div className={`text-xs mt-1 text-right ${message.sender ? 'text-gray-400': 'text-green-100'}`}>
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  )}
                </div>
              }
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
                  <div className={`text-xs flex ${message.sender ? 'text-gray-500': 'text-green-100'}`}>
                    {HandleCurrentDate(message.createdAt)}
                  </div>
                </div>
              }
              {message.messageType === 'image' && message.attachment &&
                <div className={`p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%] ${message.sender ? 'bg-white ': 'bg-green-600 text-white'}`} >
                  <img
                    src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                    alt="Media content"
                    className="object-contain border-none"
                  />
                  <div className="break-words">{message.textMessage}</div>
                  <div className={`text-xs flex ${message.sender ? 'text-gray-500': 'text-green-100'}`}>
                    {HandleCurrentDate(message.createdAt)}
                  </div>
                </div>
              }
              {message.messageType === 'video' && message.attachment &&
                <div className={`flex flex-col p-2 rounded-lg gap-1 max-w-[70%] md:max-w-[40%] ${message.sender ? 'bg-white ': 'bg-green-600 text-white'}`}>
                  <video
                    controls
                    className="max-h-[300px] object-contain rounded"
                    src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                  ></video>
                  <div className="break-words">{message.textMessage}</div>
                  <div className={`text-xs flex ${message.sender ? 'text-gray-500': 'text-green-100'}`}>
                    {HandleCurrentDate(message.createdAt)}
                  </div>
                </div>
              }
              {message.messageType === 'audio' && message.attachment &&
                <div className={`flex flex-col p-2 rounded-lg gap-1 max-w-[70%] md:max-w-[40%] ${message.sender ? 'bg-white ': 'bg-green-600 text-white'}`}>
                  <audio 
                    controls
                    src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                    ></audio>
                  <div className="break-words">{message.textMessage}</div>
                  <div className={`text-xs flex ${message.sender ? 'text-gray-500': 'text-green-100'}`}>
                    {HandleCurrentDate(message.createdAt)}
                  </div>
                </div>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
