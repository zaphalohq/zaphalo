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
        console.log(newUnseenMessage, "yeaaaaaaaaaaaaaaaaaaa");
        setNewMessage(newUnseenMessage)
    }, [newUnseenMessage])

    useEffect(() => {
        const socketIo = io(import.meta.env.VITE_WEBSOCKET_URL, {
            transports: ["websocket"],
            reconnection: true,
        });

        socketIo.on("connect", () => {
            console.log("Connected to Socket.IO server:", socketIo.id);
        });

        socketIo.on("joined", (data) => {
            console.log("Joined channel:", data);
        });

        socketIo.on("message", (messageData) => {
            try {
                const newMsg = JSON.parse(messageData);
                console.log("Parsed message:", newMsg);
                console.log(newMsg.newChannelCreated);

                setIsNewChannelCreated(newMsg.newChannelCreated)
                if (!newMsg.messages) {
                    console.error("Message payload missing 'messages' field:", newMsg);
                    return;
                }
                setNewUnseenMessage((prevMessages) => {
                    const channelIndex = prevMessages.findIndex(
                        (message) => message.channelId === newMsg.channelId
                    );
                    console.log(prevMessages, "this is newessa",);
                    console.log('this is current channelindex', channelIndex);

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
            console.log("Error:", data);
        });

        socketIo.on("disconnect", () => {
            console.log("Disconnected from Socket.IO server");
        });

        setSocket(socketIo);
        return () => {
            socketIo.disconnect();
        };
    }, []);

    return { socket, newUnseenMessage };
}