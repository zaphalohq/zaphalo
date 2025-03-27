import { FormEvent, useContext, useState } from 'react'
import { FiPaperclip } from 'react-icons/fi'
import { IoSendSharp } from 'react-icons/io5'
import axios from 'axios';
import { ChatsContext } from '../Context/ChatsContext'

const MessageArea = ({ msgData, setMsgData } : any) => {
  const { chatsDetails } : any = useContext(ChatsContext)

  const [currentMsg, setCurrentMsg] = useState("")
  const SubmitMsg = async (event : FormEvent) => {    
    event.preventDefault()
    console.log(chatsDetails.receiverId, "thosndnd ...........................");
    setMsgData(currentMsg)
    const response = await axios.post(
      "http://localhost:3000/webhook/sendMsg",
      {
        senderId: import.meta.env.VITE_SENDER_PHONENO,
        receiverId: chatsDetails.receiverId,
        msg: currentMsg,
        channelName: chatsDetails.channelName,
        channelId: chatsDetails.channelId && chatsDetails.channelId != ''? chatsDetails.channelId : null,
      },
      {
        headers: {
          Authorization: import.meta.env.VITE_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    if(response.status == 201) { 
      console.log(response);
      
      setCurrentMsg("")
    }

  }
  return (
    <form onSubmit={SubmitMsg}>
    <div className="flex items-center justify-between bg-stone-200 p-6 px-8">
    <button className="text-2xl p-2 hover:bg-stone-300 cursor-pointer"><FiPaperclip /></button>
    <input required onChange={(e) => setCurrentMsg(e.target.value)} className="bg-white w-full mx-4 p-2 border-none outline-none" value={currentMsg} type="text" placeholder="type a message here ..." />
    <button className="text-2xl p-2 hover:bg-stone-300 cursor-pointer"><IoSendSharp /></button>
  </div>
  </form>
  )
}

export default MessageArea
