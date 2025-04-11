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
    isNewChannelCreated : any, 
    setIsNewChannelCreated : Function,   
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
            phoneNo: '',
        }
    })

    const [newMessage, setNewMessage] = useState([{
            channelId: '',
            phoneNo: '',
            message: [], // Array of messages
            unseen: 0,
        }])

    // const [ newMessage, setNewMessage ] = useState([{
    //     channelId: '',
    //     phoneNo: '',
    //     message: {},
    //     unseen: 0
    // }])

    //---------------it handles boolean when new channel is created wite websocket--------------
    const [ isNewChannelCreated, setIsNewChannelCreated ] = useState(false);


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
            isNewChannelCreated, 
            setIsNewChannelCreated, 
        }}>
            {children}
        </ChatsContext.Provider>
    )
}