import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "@src/components/Context/ChatsContext"

function getInitials(name = "") {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return initials.toUpperCase();
}


const CurrentChannel = ({ channelName, channelId, memberIds, unseen, setIsChannelExist }: any) => {
  const { chatsDetails, setChatsDetails, newMessage, setNewMessage, isNewChannelCreated }: any = useContext(ChatsContext)
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);
  const [isUnseen, setIsUnseen] = useState(true);

  useEffect(() => {
    if (!newMessage) return;
    const currentChannelindex = newMessage?.findIndex((message: any) => message.channelId === channelId) ?? -1;
    const currentChannel = currentChannelindex !== -1 ? newMessage[currentChannelindex] : null;
    if (currentChannel && currentChannelindex !== -1 && channelId !== chatsDetails.channelId) {

      if (isUnseen) {
        setUnseenMessageCount(unseen + currentChannel.unseen)
      } else {
        setUnseenMessageCount(currentChannel.unseen)
      }
    }
  }, [newMessage])

  useEffect(() => {
    if (channelId !== chatsDetails.channelId) setUnseenMessageCount(unseen)
      
  }, [channelId])

  const HandleCurrentChannel = async () => {
    const allMemberNumbers = memberIds.map((member: any) => member.phoneNo)
    
    // const receiverNumbers = allMemberNumbers.filter((number: any) => number != import.meta.env.VITE_SENDER_PHONENO)
    const currentChannel = {
      channelName,
      channelId,
      memberIds: allMemberNumbers,
      receiverId: allMemberNumbers,
      // phoneNo: receiverNumbers
    }

    await setChatsDetails(currentChannel)

    const currentChannelIndex = await newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);

    if (currentChannelIndex !== -1) {
      await newMessage.splice(currentChannelIndex, 1)
      await setNewMessage(newMessage)
    }
    setUnseenMessageCount(0)
    setIsUnseen(false)
  }

  const { setIsChatOpen }: any = useContext(ChatsContext);
  return (
    <div
      onClick={() => {
          HandleCurrentChannel()
          setIsChatOpen(true)
        }
      }
      className={`px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${channelId === chatsDetails.channelId ? 'bg-green-50' : ''}`}
    >
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">{getInitials(channelName)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium truncate">{channelName}</div>
           {unseenMessageCount !== 0 ?
             <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>
               {unseenMessageCount}
             </div> : <></>}
        </div>
      </div>
    </div>
  )
}

export default CurrentChannel
