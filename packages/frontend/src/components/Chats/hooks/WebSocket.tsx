import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getItem, setItem } from "../../utils/localStorage";

interface Message {
    channelId: string;
    phoneNo: string;
    message: string[]; // Array of messages
    unseen: number;
}

export async function useWebSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    
    const [messages, setMessages] = useState<Message[]>(()  =>  {
        const getMessage = getItem("messages")
        return getMessage || []
    });

    useEffect(() => {
        setItem("messages", messages)
        console.log(messages);
    }, [messages])

    useEffect(() => {
        const socketIo = io("http://localhost:8080", {
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
            //     const newMsg = JSON.parse(messageData);
            //     console.log("Received message:", messages.length );
            //     const findChannel = messages.length !== 0 ? messages.filter((message) => {
            //         return message.channelId === newMsg.channelId
            //     }) : null
            //     console.log(findChannel,".......................................................................");
            //     if(findChannel !== null && findChannel.length !== 0){
            //      console.log(findChannel,'......');
            //     }
            //     else{ 
            //         setMessages((prev) => [
            //         ...prev,
            //         {
            //             channelId : newMsg.channelId,
            //             phoneNo : newMsg.phoneNo,
            //             message : [newMsg.messages],
            //             unseen : 0
            //         }
            //     ])
            // }


            try {
                const newMsg = JSON.parse(messageData);
                console.log("Parsed message:", newMsg);

                if (!newMsg.messages) {
                    console.error("Message payload missing 'messages' field:", newMsg);
                    return;
                }

                setMessages((prevMessages) => {
                    // Find if a channel with the same channelId exists
                    const channelIndex = prevMessages.findIndex(
                        (message) => message.channelId === newMsg.channelId
                    );
                    console.log('this is current channelindex', channelIndex);
                    
                    if (channelIndex !== -1) {
                        // Channel exists, append the new message to its message array
                        const updatedMessages = [...prevMessages];
                        updatedMessages[channelIndex] = {
                            ...updatedMessages[channelIndex],
                            message: [
                                ...updatedMessages[channelIndex].message,
                                newMsg.messages,
                            ],
                            unseen: updatedMessages[channelIndex].unseen + 1,
                        };
                        return updatedMessages;
                    } else {
                        // Channel doesn’t exist, add a new entry
                        return [
                            ...prevMessages,
                            {
                                channelId: newMsg.channelId || "",
                                phoneNo: newMsg.phoneNo || "",
                                message: [newMsg.messages],
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

        // Cleanup on unmount or when channelId changes
        return () => {
            socketIo.disconnect();
        };
    }, []); // Re-run when channelId changes

    return { socket, messages };
}