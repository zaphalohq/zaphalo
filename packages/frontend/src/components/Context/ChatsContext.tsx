import { createContext, useState } from "react";

export interface ChatsContectProps {
    chatDetails : any,
    setChatDetails : Function, 
}

export const ChatsContext = createContext<ChatsContectProps | undefined>(undefined)

export const ChatsProvider = ({ children } : any) => {
    const [ chatDetails , setChatDetails ] = useState({
        contactName : "",
        phoneNo : "",
        profileImg : ""
    })

    return(
        <ChatsContext.Provider value={{
            chatDetails,
            setChatDetails
        }}>
        {children}
        </ChatsContext.Provider>
    )
}