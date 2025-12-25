import { useQuery, useMutation, gql } from "@apollo/client";
import { useEffect, useRef, useState, useContext } from "react";
import { ChannelMessage, MakeUnseenMsgSeen } from "@src/generated/graphql";
import { ChatsContext } from "@components/Context/ChatsContext"
import { VITE_BACKEND_URL } from '@src/config';
import { useWebSocket } from "@src/modules/chat/hooks/useWebSocket";
import { FiClock, FiDownload } from 'react-icons/fi';
import { FaCheck, FaCheckDouble, FaCircle, FaExclamationCircle } from "react-icons/fa";

interface Message {
  id: string;
  text: string;
  sender: any;
  createdAt: string;
}

interface TickMarkProps {
  status: 'outgoing' | 'sent' | 'delivered' | 'read' | 'failed';
}

export const TickMark = ({ status }: TickMarkProps) => {
  const base = "inline-flex items-center leading-none";

  switch (status) {
    case 'outgoing':
      return (
        <span className={`${base} text-white/90`}>
          <FiClock size={13} />
        </span>
      );

    case 'sent':
      return (
        <span className={`${base} text-white/90
`}>
          <FaCheck size={13} />
        </span>
      );

    case 'delivered':
      return (
        <span className={`${base} text-white/90`}>
          <FaCheckDouble size={13} />
        </span>
      );

    case 'read':
      return (
        <span className={`${base} text-sky-400`}>
          <FaCheckDouble size={13} />
        </span>
      );

    case 'failed':
      return (
        <span className={`${base} text-red-500`}>
          <FaExclamationCircle size={13} />
        </span>
      );

    default:
      return null;
  }
};


export default function MessageDisplay() {
  const LIMIT = 20;
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const { chatsDetails, newMessage, setNewMessage, myCurrentMessage, messageStateUpdate }: any = useContext(ChatsContext)
  const containerRef = useRef<HTMLDivElement>(null);


  const { data, loading, error, fetchMore } = useQuery(ChannelMessage, {
    variables: { channelId: chatsDetails?.channelId, cursor: null, limit: LIMIT },
    fetchPolicy: "cache-and-network",
  });
  const [makeUnseenMsgSeen, { data: makeSeenMsgUnseenData }] = useMutation(MakeUnseenMsgSeen);

  const { socketMessages }: any = useWebSocket()

  const HandleCurrentDate = (createdAt: any) => {
    const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return currentDate
  }

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const groupMessagesByDate = (msgs: any[]) => {
    // Group messages by date
    const grouped = msgs.reduce((groups: any, message: any) => {
      const dateKey = new Date(message.createdAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(message);
      return groups;
    }, {});

    // Sort messages *inside each date group* by createdAt ascending
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    return grouped;

  };

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
          createdAt: message.createdAt,
          attachment: {
            originalname: message.originalname
          },
        }));

        setMessages(prev => {
          // Combine new and old messages
          const combined = [...newMessages.slice().reverse(), ...prev,];

          // Remove duplicates by ID
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());

          return unique;
        });
        if (currentChannel.messagesId) {
          makeUnseenMsgSeen({
            variables: { messageId: currentChannel?.messagesId || '' },
          })
        }
      }
    }
  }, [newMessage]);

  useEffect(() => {
    if (!messageStateUpdate) return;
    
    const { channelId, messageId, state } = messageStateUpdate;
    
    if (channelId === chatsDetails.channelId) {
      setMessages((prevMessages) => {
        return prevMessages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              state: state  
            };
          }
          return message;
        });
      });
    }
  }, [messageStateUpdate]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex h-[calc(100vh-20%)] p-6 bg-[#efeae2] scroll-smooth">
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

        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="text-center my-4">
              <span className="bg-[#d9fdd3] text-gray-700 text-sm px-3 py-1 rounded-full shadow-sm">
                {formatChatDate(date)}
              </span>
            </div>

            {groupedMessages[date].map((message: any) => (
              <div key={message.id} className="relative z-10 p-4">
                <div className={`flex mb-4 ${message.sender ? 'justify-start' : 'justify-end'}`}>

                  {message.messageType === 'text' && (
                    <div className={`border rounded-br-2xl rounded-tl-xl rounded-tr-2xl p-3 max-w-md shadow-sm ${message.sender ? 'bg-white ' : 'bg-green-600 text-white'}`}>
                      <div className="whitespace-pre-wrap">{message.textMessage}</div>
                      {message.textMessage && (
                        <div
                          className={`flex items-center justify-between gap-5 text-xs mt-2 ${message.sender ? 'text-gray-400' : 'text-green-100'
                            }`}
                        >
                          <span>{HandleCurrentDate(message.createdAt)}</span>
                          {!message.sender && <TickMark status={message.state} />}
                        </div>
                      )}
                    </div>
                  )}

                  {message.messageType === 'document' && message.attachment && (
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
                      <div
                        className={`flex items-center justify-between gap-5 text-xs mt-2 ${message.sender ? 'text-gray-400' : 'text-green-100'}`}
                      >
                        <span>{HandleCurrentDate(message.createdAt)}</span>
                        {!message.sender && <TickMark status={message.state} />}
                      </div>
                    </div>
                  )}

                  {message.messageType === 'image' && message.attachment && (
                    <div className={`p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%] ${message.sender ? 'bg-white ' : 'bg-green-600 text-white'}`}>
                      <img
                        src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                        alt="Media content"
                        className="object-contain border-none rounded-lg"
                      />
                      <div className="break-words">{message.textMessage}</div>
                      <div
                        className={`flex items-center justify-between gap-5 text-xs mt-2 ${message.sender ? 'text-gray-400' : 'text-green-100'}`}
                      >
                        <span>{HandleCurrentDate(message.createdAt)}</span>
                        {!message.sender && <TickMark status={message.state} />}
                      </div>
                    </div>
                  )}

                  {message.messageType === 'video' && message.attachment && (
                    <div className={`flex flex-col p-2 rounded-lg gap-1 max-w-[70%] md:max-w-[40%] ${message.sender ? 'bg-white ' : 'bg-green-600 text-white'}`}>
                      <video
                        controls
                        className="max-h-[300px] object-contain rounded"
                        src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}
                      ></video>
                      <div className="break-words">{message.textMessage}</div>
                      <div
                        className={`flex items-center justify-between gap-5 text-xs mt-2 ${message.sender ? 'text-gray-400' : 'text-green-100'}`}
                      >
                        <span>{HandleCurrentDate(message.createdAt)}</span>
                        {!message.sender && <TickMark status={message.state} />}
                      </div>
                    </div>
                  )}

                  {message.messageType === 'audio' && message.attachment && (
                    <div className={`flex flex-col p-2 rounded-lg gap-1 max-w-[70%] md:max-w-[40%] ${message.sender ? 'bg-white ' : 'bg-green-600 text-white'}`}>
                      <audio controls src={`${VITE_BACKEND_URL}/files/${message.attachmentUrl}`}></audio>
                      <div className="break-words">{message.textMessage}</div>
                      <div
                        className={`flex items-center justify-between gap-5 text-xs mt-2 ${message.sender ? 'text-gray-400' : 'text-green-100'}`}
                      >
                        <span>{HandleCurrentDate(message.createdAt)}</span>
                        {!message.sender && <TickMark status={message.state} />}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
