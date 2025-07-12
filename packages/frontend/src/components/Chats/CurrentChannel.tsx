import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "@src/components/Context/ChatsContext"

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
    const receiverNumbers = allMemberNumbers.filter((number: any) => number != import.meta.env.VITE_SENDER_PHONENO)
    const currentChannel = {
      channelName,
      channelId,
      memberIds: allMemberNumbers,
      receiverId: allMemberNumbers,
      phoneNo: receiverNumbers
    }

    await setChatsDetails(currentChannel)
    localStorage.setItem('chatsDetails', JSON.stringify(currentChannel))

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
    <div>
      <div onClick={() => {
        HandleCurrentChannel()
        setIsChatOpen(true)
      }
      }
        className={`flex cursor-pointer items-center justify-between rounded mx-2 
                       px-6 py-3 
                       ${channelId === chatsDetails.channelId ? 'bg-light' : 'hover-light'}
                       `}>
        <div className='flex gap-4'>
          <div className="w-8 h-8 bg-blue-200 rounded-full flex justify-center text-blue-500 font-bold text-sm items-center">{channelName?.slice(0, 1).toUpperCase()}</div>
          <div className="flex items-center">
            <p className='font-bold truncate w-[9rem]'>{channelName}</p>
          </div>
        </div>
        <span className='flex flex-col items-end text-sm'>
          {unseenMessageCount !== 0 ?
            <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>
              {unseenMessageCount}
            </div>
            : <></>}
        </span>
      </div>
    </div>
  )
}

export default CurrentChannel
