import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatsContext } from "@components/Context/ChatsContext";

interface Message {
    channelId: string;
    phoneNo: string;
    textMessage: string[];
    unseen: number;
}

export async function useWebSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { newMessage, setNewMessage, setIsNewChannelCreated }: any = useContext(ChatsContext)

    const [newUnseenMessage, setNewUnseenMessage] = useState<Message[]>(
        [{
            channelId: '',
            phoneNo: '',
            textMessage: [],
            unseen: 0,
        }])

    useEffect(() => {
        setNewMessage(newUnseenMessage)
    }, [newUnseenMessage])

    useEffect(() => {
        const socketIo = io(import.meta.env.VITE_WEBSOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
        });

        socketIo.on("connect", () => {
        });

        socketIo.on("joined", (data) => {
        });

        socketIo.on("message", (messageData) => {
            try {
                const newMsg = JSON.parse(messageData);
                setIsNewChannelCreated(newMsg.newChannelCreated)
                if (!newMsg.messages) {
                    console.error("Message payload missing 'messages' field:", newMsg);
                    return;
                }
                setNewUnseenMessage((prevMessages) => {
                    const channelIndex = prevMessages.findIndex(
                        (message) => message.channelId === newMsg.channelId
                    );

                    if (channelIndex !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[channelIndex] = {
                            ...updatedMessages[channelIndex],
                            textMessage: [
                                ...updatedMessages[channelIndex].textMessage,
                                newMsg.messages,
                            ],
                            unseen: updatedMessages[channelIndex].unseen + 1,
                        };
                        return updatedMessages;
                    } else {
                        return [
                            ...prevMessages,
                            {
                                channelId: newMsg.channelId || "",
                                phoneNo: newMsg.phoneNo || "",
                                textMessage: [newMsg.messages],
                                unseen: 1,
                            },
                        ];
                    }
                });
            } catch (error) {
                console.error("Error parsing message data:", error);
            }

        });

        socketIo.on("error", (data) => {
            console.error("Error:", data);
        });

        socketIo.on("disconnect", () => {
        });

        setSocket(socketIo);
        return () => {
            socketIo.disconnect();
        };
    }, []);

    return { socket, newUnseenMessage };
}