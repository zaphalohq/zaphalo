import { createContext, useState } from "react";
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
    isChatOpen : any, 
    setIsChatOpen : Function,
}

export const ChatsContext = createContext<ChatsContectProps | undefined>(undefined)

export const ChatsProvider = ({ children }: any) => {

    const [chatsDetails, setChatsDetails] = useState(async () => {
        // const item = localStorage.getItem("chatsDetails");
        let chatsDetails = {
            receiverId: [],
            profileImg: '',
            channelName: '',
            sender: '',
            memberIds: '',
            channelId: '',
            phoneNo: '',
        };
        // if(item) chatsDetails = await JSON.parse(item);
        
        return chatsDetails 
    })

    const [newMessage, setNewMessage] = useState([{
            sender: '',
            channelId: '',
            phoneNo: '',
            messageId: '',
            textMessage: [],
            unseen: 0,
        }])

    const [ isNewChannelCreated, setIsNewChannelCreated ] = useState(false);

    const [myCurrentMessage, setMyCurrentMessage] = useState([])

    const [ isUpdateChannelName, setIsUpdateChannelName] = useState(false)

    const [ isChatOpen, setIsChatOpen ] = useState(false)

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
            isChatOpen, 
            setIsChatOpen, 
        }}>
            {children}
        </ChatsContext.Provider>
    )
}