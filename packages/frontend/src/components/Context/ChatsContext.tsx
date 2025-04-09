import { createContext, useState } from "react";
import { getItem } from "../utils/localStorage"
export interface ChatsContectProps {
    chatsDetails: any,
    setChatsDetails: Function,
    newMessage: any,
    setNewMessage: Function,
    myCurrentMessage: any,
    setMyCurrentMessage: Function,
    isUpdateChannelName : any,
    setIsUpdateChannelName : Function,
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
            channelId: '',
        }
    })

    const [newMessage, setNewMessage] = useState(() => {
        const getMessage = getItem("messages")
        return getMessage || [{
            channelId: '',
            phoneNo: '',
            message: {},
            unseen: 0
        }]
    })


    const [myCurrentMessage, setMyCurrentMessage] = useState({
        message: '',
        count: 0,
        attachmentUrl : ''
    })

    const [ isUpdateChannelName, setIsUpdateChannelName] = useState(false)
    return (
        <ChatsContext.Provider value={{
            chatsDetails,
            setChatsDetails,
            newMessage,
            setNewMessage,
            myCurrentMessage,
            setMyCurrentMessage,
            isUpdateChannelName, 
            setIsUpdateChannelName,
        }}>
            {children}
        </ChatsContext.Provider>
    )
}