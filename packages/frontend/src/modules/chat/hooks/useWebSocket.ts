import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatsContext } from "@components/Context/ChatsContext";
import { VITE_WEBSOCKET_URL } from '@src/config';
import { useSocket } from "@src/modules/socket/contexts/SocketContext";

interface Message {
  sender: string,
  channelId: string;
  phoneNo: string;
  messagesId: string;
  messageData: [],
  unseen: number;
}

export function useWebSocket() {
  // const [socketVal, setSocketVal] = useState<Socket | null>(null);
  const { socket } = useSocket();
  const { newMessage, setNewMessage, setIsNewChannelCreated, setMyCurrentMessage }: any = useContext(ChatsContext)

  const [newUnseenMessage, setNewUnseenMessage] = useState<Message[]>(
    [])

  useEffect(() => {
    setNewMessage(newUnseenMessage)
  }, [newUnseenMessage])

  useEffect(() => {
    socket.on("message", (messageData) => {
      console.log(messageData)
      try {
        const newMsg = JSON.parse(messageData);
        setIsNewChannelCreated(newMsg.newChannelCreated)
        if (!newMsg.messages) {
          console.error("Message payload missing 'messages' field:", newMsg);
          return;
        }
        setNewUnseenMessage((prevMessages: any) => {
          const channelIndex = prevMessages.findIndex(
            (message: any) => message.channelId === newMsg.channelId
            );

          const newMessageData = {
            id: newMsg.messages.id,
            sender: newMsg.sender,
            textMessage: newMsg.messages.textMessage,
            messageType: newMsg.messages.messageType,
            originalname: newMsg.messages.attachmentName || "",
            attachmentUrl: newMsg.messages?.attachmentUrl || "",
            createdAt: newMsg.messages.createdAt
          };

          if (channelIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[channelIndex] = {
              ...updatedMessages[channelIndex],
              messageData: [
                ...(updatedMessages[channelIndex].messageData || []),
                newMessageData
              ],
              messagesId: newMsg.messages.id,
              unseen: updatedMessages[channelIndex].unseen + 1,
            };
            return updatedMessages;
          } else {
            return [
              ...prevMessages,
              {
                id: newMsg.messages.id,
                sender: newMsg.sender,
                channelId: newMsg.channelId || "",
                phoneNo: newMsg.phoneNo || "",
                messagesId: newMsg.messages.id,
                messageData: [newMessageData],
                unseen: 1,
              },
            ];
          }
        });
      } catch (error) {
        console.error("Error parsing message data:", error);
      }

    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  return { socket, newUnseenMessage };
}