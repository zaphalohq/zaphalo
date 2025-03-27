import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "../Context/ChatsContext"
import { getItem, setItem } from "../utils/localStorage"

const ChannelList = ({ channelName, lastmsg, channelId, memberIds }: any) => {
  const { chatsDetails, setChatsDetails }: any = useContext(ChatsContext)

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


const [ newMessageCount, setNewMessageCount ] = useState(0)

useEffect(() => {
  const newMessage = getItem("messages");
  const currentChannel = newMessage.find((message: any) => message.channelId === channelId);
  // setNewMessageCount(currentChannel)
  setNewMessageCount(currentChannel ? currentChannel.message.length : 0)
},[getItem("messages")])
  return (
    <div>
      {/* <button onClick={BUTTON}>BUTTON</button> */}
      {/* this is the main */}
      <div onClick={ async () => {        
        await setChatsDetails({
          channelName,
          channelId,
          memberIds: [...receiverphoneNo, import.meta.env.VITE_SENDER_PHONENO],
          receiverId: receiverphoneNo,
        })
        setItem('chatsDetails', {
          channelName,
          channelId,
          memberIds: [...receiverphoneNo, import.meta.env.VITE_SENDER_PHONENO],
          receiverId: receiverphoneNo,
        })
        setReceiverphoneNo([])
      }
      } className='flex cursor-pointer items-center justify-between px-6 py-3 hover:bg-stone-100 border-b border-stone-300'>
        <div className='flex gap-4'>
          {/* Profile Picture */}
          {/* <img className='w-11 h-11 object-cover rounded-full' src="https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/L73IDX7GKCHAD7EJJS7FQ7A6BU.JPG&w=1200" alt="" /> */}
          <div className="w-11 h-11 bg-blue-200 rounded-full flex justify-center text-blue-500 font-bold text-lg items-center">{channelName.slice(0, 1).toUpperCase()}</div>
          {/* Message Details */}
          <div>
            <p className='font-bold truncate w-[9rem]'>{channelName}</p>
            <div className='truncate w-[9.375rem]'>{lastmsg}</div>
          </div>
        </div>
        {/* Message Time and Notification */}
        <span className='flex flex-col items-end text-sm'>
          <div>12:00</div>
          <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>2</div>
        </span>
      </div>
    </div>
  )
}

export default ChannelList
