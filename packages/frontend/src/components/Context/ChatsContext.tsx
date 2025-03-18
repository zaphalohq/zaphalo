import { createContext, useEffect, useState } from "react";

export interface ChatsContectProps {
    chatsDetails: any,
    setChatsDetails: Function,
}

export const ChatsContext = createContext<ChatsContectProps | undefined>(undefined)

export const ChatsProvider = ({ children }: any) => {

    
    const [chatsDetails, setChatsDetails] = useState({
        receiverId: [],
        profileImg: '',
        channelName: '',
        memberIds: '',
    })


    return (
        <ChatsContext.Provider value={{
            chatsDetails,
            setChatsDetails,
        }}>
            {children}
        </ChatsContext.Provider>
    )
}