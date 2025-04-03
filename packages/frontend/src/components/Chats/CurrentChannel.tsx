import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "../Context/ChatsContext"
import { getItem, setItem } from "../utils/localStorage"
import { useQuery } from "@apollo/client"
import { findAllUnseen } from "../../pages/Mutation/Chats"

const ChannelList = ({ channelName, channelId, memberIds, setIsChannelExist, isChannelExist }: any) => {
  const { chatsDetails, setChatsDetails }: any = useContext(ChatsContext)
  const { newMessage, setNewMessage } : any = useContext(ChatsContext) //all new messages


  //--------------getting the receiver phone No for sending the message to particular number----
  const [receiverphoneNo, setReceiverphoneNo] = useState([])
 useEffect (() => {
    memberIds.forEach((member: any) => {
      if (member.phoneNo != import.meta.env.VITE_SENDER_PHONENO) {
        // phoneNo.push(member.phoneNo);
        // console.log("this is phoenno" , member.phoneNo);
        
        setReceiverphoneNo((prev): any => [...prev, member.phoneNo])
      }
    })
    
    return () => {
      setReceiverphoneNo([])
    }
  },[memberIds])




//------------------new message count----------------------------
  const [ newMessageCount, setNewMessageCount ] = useState(0)
  // const { newMessage } = useContext(ChatsContext)
  useEffect(() => {
    

    const currentChannel = newMessage.find((message: any) => message.channelId === channelId) || null;
    if(currentChannel == null)
      setIsChannelExist(isChannelExist + 1)
      console.log(currentChannel)
    if( currentChannel && currentChannel.unseen)
      setNewMessageCount(currentChannel.unseen)     
    else{
      setNewMessageCount(0)
    }
  },[newMessage,channelId, newMessageCount])


  
//------------------fetch unseen message-------------------------
const { data, loading, refetch } = useQuery(findAllUnseen);
// Fetch and set data when it becomes available
// Initialize state with unseen messages from the query
useEffect(() => {
  if (!loading && data) {

    const unseenMessages = data.findAllUnseen || [];
    console.log(unseenMessages, "this is the data");

    // Using reduce to group messages
    const formattedMessages = unseenMessages.reduce(( unseenMessage : any, message : any) => {
      const existingChannel = unseenMessage.find(
        (msg : any) => msg.channelId === message.channel.id
      );

      if (existingChannel) {
        // Channel exists, append message and increment unseen
        existingChannel.message.push(message.message);
        existingChannel.unseen += 1;
        return unseenMessage || [];
      } else {
        // New channel, add entry
        return [
          ...unseenMessage,
          {
            channelId: message.channel.id,
            phoneNo: message.sender.phoneNo,
            message: [message.message],
            unseen: 1,
          },
        ];
      }
    }, []);

    setNewMessage(formattedMessages); // Set initial state
    setItem("messages", formattedMessages)
    }
  }, []);


//------------------Handle Current Channel-------------------------
const HandleCurrentChannel =  async () => {   
  const currentChannel = {
    channelName,
    channelId,
    memberIds: [...receiverphoneNo, import.meta.env.VITE_SENDER_PHONENO],
    receiverId: receiverphoneNo,
  }

  await setChatsDetails(currentChannel)
  setItem('chatsDetails', currentChannel)
  setReceiverphoneNo([])


  //--------------------------delete the channel from localStorage and setNewMessage when seen----------------------
  const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === channelId);
  if(currentChannelIndex !== -1){
    newMessage.splice(currentChannelIndex, 1)
    setNewMessage(newMessage)
    setItem("messages", newMessage);
    setNewMessageCount(0)
  }
}

  return (
    <div>
      {/* this is the main */}
      <div onClick={HandleCurrentChannel} 
           className={`flex cursor-pointer items-center justify-between 
                       px-6 py-3  border-stone-300
                       ${channelId === chatsDetails.channelId ? 'bg-stone-300' : 'hover:bg-stone-100 border-b'}
                       `}>
        <div className='flex gap-4'>
          {/* Profile Picture */}
          {/* <img className='w-11 h-11 object-cover rounded-full' src="https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/L73IDX7GKCHAD7EJJS7FQ7A6BU.JPG&w=1200" alt="" /> */}
          <div className="w-11 h-11 bg-blue-200 rounded-full flex justify-center text-blue-500 font-bold text-lg items-center">{(channelName).slice(0, 1).toUpperCase()}</div>
          {/* Message Details */}
          <div className="flex items-center">
            <p className='font-bold truncate w-[9rem]'>{channelName}</p>
          </div>
        </div>
        {/* Message Time and Notification */}
        <span className='flex flex-col items-end text-sm'>
          {/* <div>12:00</div> */}
          {newMessageCount !== 0 ? 
            <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>
              {newMessageCount} 
            </div> 
          : <></>} 
        </span>
      </div>     
    </div>
  )
}

export default ChannelList
