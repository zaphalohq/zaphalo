import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "@Context/ChatsContext"
import { setItem } from "@utils/localStorage"


const CurrentChannel = ({ channelName, channelId, memberIds, unseen, setIsChannelExist }: any) => {
  const { chatsDetails, setChatsDetails, newMessage, setNewMessage, isNewChannelCreated }: any = useContext(ChatsContext)

  //------------------new message count----------------------------
  const [ unseenMessageCount, setUnseenMessageCount ] = useState(0)
  const [ isUnseen, setIsUnseen ] = useState(true)
  useEffect(() => {
    //----------update the count when new messages arrives--------------
    console.log(unseen,"unseen", newMessage, "newMessage", )
    if (!newMessage) return;
    const currentChannelindex = newMessage?.findIndex((message: any) => message.channelId === channelId) ?? -1;
    const currentChannel = currentChannelindex !== -1 ? newMessage[currentChannelindex] : null;
    if (currentChannel && currentChannelindex !== -1 && channelId !== chatsDetails.channelId){
      
      if(isUnseen) {
        setUnseenMessageCount(unseen + currentChannel.unseen)
      }else {
        setUnseenMessageCount(currentChannel.unseen)
      }
   }
  }, [newMessage]) 

  //---------------set count of all unseen messages when the page render----------------
  useEffect(() => {
    if(channelId !== chatsDetails.channelId) setUnseenMessageCount(unseen)
  },[channelId])

  //------------------Handle Current Channel-------------------------
  const HandleCurrentChannel = async () => {
    const allMemberNumbers = memberIds.map((member: any) => member.phoneNo)
      
    const receiverNumbers = allMemberNumbers.filter((number : any) => number != import.meta.env.VITE_SENDER_PHONENO)

    const currentChannel = {
      channelName,
      channelId,
      memberIds: allMemberNumbers,
      receiverId: receiverNumbers,
      phoneNo: receiverNumbers[0]
    }

    await setChatsDetails(currentChannel)
    setItem('chatsDetails', currentChannel)


    //--------------------------delete the channel from localStorage and setNewMessage when seen----------------------
    const currentChannelIndex = await newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);
    console.log(unseen,"unseen", newMessage, "newMessage", );
    
    if (currentChannelIndex !== -1) {
      await newMessage.splice(currentChannelIndex, 1)
      await setNewMessage(newMessage)
    }
    console.log(unseen,"unseen", newMessage, "newMessage", );
    setUnseenMessageCount(0)
    setIsUnseen(false)
  }

const { setIsChatOpen }: any = useContext(ChatsContext);
  return (
    <div>
      {/* this is the main */}
      <div onClick={ () =>{ 
        HandleCurrentChannel()
        setIsChatOpen(true)
      }
      }
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
          {unseenMessageCount !== 0 ?
            <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>
              {unseenMessageCount}
            </div>
            : <></>}
        </span>
        {/* <button className="p-2 cursor-pointer rounded hover:bg-stone-300 text-lg"><FaEllipsisVertical /></button> */}
      </div>
    </div>
  )
}

export default CurrentChannel
