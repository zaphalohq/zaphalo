import { FormEvent, useContext, useState } from 'react'
import { FiPaperclip } from 'react-icons/fi'
import { IoSendSharp } from 'react-icons/io5'
import axios from 'axios';
import { ChatsContext } from '../Context/ChatsContext'
import { SEND_MESSAGE } from '../../pages/Mutation/Chats';
import { useMutation } from '@apollo/client';

const MessageArea = () => {
  const { chatsDetails } : any = useContext(ChatsContext)
  const { setMyCurrentMessage } : any = useContext(ChatsContext)

  const [currentMsg, setCurrentMsg] = useState("")
  // Apollo mutation hook
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const SubmitMsg = async (event : FormEvent) => {    
    event.preventDefault()
    setMyCurrentMessage(currentMsg)
    
    
    // const response = await axios.post(
    //   "http://localhost:3000/webhook/sendMsg",
    //   {
    //     senderId: import.meta.env.VITE_SENDER_PHONENO,
    //     receiverId: chatsDetails.receiverId,
    //     msg: currentMsg,
    //     channelName: chatsDetails.channelName,
    //     channelId: chatsDetails.channelId && chatsDetails.channelId != ''? chatsDetails.channelId : null,
    //   },
    //   {
    //     headers: {
    //       Authorization: import.meta.env.VITE_TOKEN,
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );

    // if(response.status == 201) { 
    //   console.log(response);
      
    //   setCurrentMsg("")
    // }



    const variables = {
      input: {
        senderId: Number(import.meta.env.VITE_SENDER_PHONENO), // Replace with actual sender ID (e.g., from auth)
        receiverId: chatsDetails.receiverId, // Array with the selected contact
        msg: currentMsg,
        channelName: chatsDetails.channelName, // Default or dynamic channel name
        channelId: chatsDetails.channelId && chatsDetails.channelId != ''? chatsDetails.channelId : '', // Optional; set if you have an existing channel
      },
    };
    setCurrentMsg("")
    try {
      console.log("Sending variables:", JSON.stringify(variables, null, 2))
            const response = await sendMessage({ variables });
      console.log("Message sent:", response.data.sendMessage.message);
    } catch (err) {
      console.error("Error sending message:", err);
    }

    // if(!loading && !error) {       
    //   setCurrentMsg("")
    // }

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
