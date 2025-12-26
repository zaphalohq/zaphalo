import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatsContext } from "@components/Context/ChatsContext";
import { VITE_WEBSOCKET_URL } from '@src/config';
import { useSocket } from "@src/modules/socket/contexts/SocketContext";
import { useLazyQuery } from "@apollo/client";
import { FetchMessage } from '@src/generated/graphql'

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
  const { newMessage, setNewMessage, setIsNewChannelCreated, setMyCurrentMessage, setMessageStateUpdate }: any = useContext(ChatsContext)

  const [newUnseenMessage, setNewUnseenMessage] = useState<Message[]>(
    [])
  
  const [ fetchMessageById ] = useLazyQuery(FetchMessage, {
    fetchPolicy: "network-only", 
  });


  useEffect(() => {
    setNewMessage(newUnseenMessage)
  }, [newUnseenMessage])

  useEffect(() => {
    socket.on("message", async (messageData) => {
      try {
        const newMsg = JSON.parse(messageData);

        const { data } = await fetchMessageById({
          variables: { messageId: newMsg.messages.id },
        });
        
        const fetchedMsg= data.fetchMessageById

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
            id: fetchedMsg.id,
            sender: fetchedMsg?.sender.phoneNo,
            textMessage: fetchedMsg.textMessage,
            messageType: fetchedMsg.messageType,
            originalname: fetchedMsg?.attachment?.originalname || "",
            attachmentUrl: fetchedMsg?.attachmentUrl || "",
            createdAt: fetchedMsg.createdAt
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

    socket.on("createMessage", async (messageData) => {
      try {
        const payload = JSON.parse(messageData);
        const { messageId } = payload

        const { data } = await fetchMessageById({
          variables: { messageId },
        });

        const msg = data.fetchMessageById;

        if(!msg) return

        setMyCurrentMessage([msg]);

      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    })

    socket.on("messageStateUpdated", async(payloadData)=>{
      try{
        const payload = JSON.parse(payloadData)
        const { channelId, messageId, state } = payload;

        setMessageStateUpdate({
          channelId,
          messageId,
          state,
        });
      }catch(err){
        console.error("Error in update state of message",err)
      }
    })

    return () => {
      socket.off("message");
      socket.off("createMessage");
      socket.off("messageStateUpdated");
    };
  }, [socket]);

  return { socket, newUnseenMessage };
}