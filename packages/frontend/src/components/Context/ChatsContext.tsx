import { createContext, useEffect, useState } from "react";
import { getItem } from "../utils/localStorage"
export interface ChatsContectProps {
    chatsDetails: any,
    setChatsDetails: Function,
    newMessage: any,
    setNewMessage: Function
}

export const ChatsContext = createContext<ChatsContectProps | undefined>(undefined)

export const ChatsProvider = ({ children }: any) => {

    const [chatsDetails, setChatsDetails] = useState(() => {
        const item = getItem("chatsDetails")
        return item || {
        receiverId: [],
        profileImg: '',
        channelName: '',
        memberIds: '',
    }
    })

    const [ newMessage, setNewMessage ] = useState(
        ()  =>  {
            const getMessage = getItem("messages")
            return getMessage || [{
        channelId : '',
        phoneNo : '',
        message : {},
        unseen : 0
    }]})

    return (
        <ChatsContext.Provider value={{
            chatsDetails,
            setChatsDetails,
            newMessage, 
            setNewMessage
        }}>
            {children}
        </ChatsContext.Provider>
    )
}