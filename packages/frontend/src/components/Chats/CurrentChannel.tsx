import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "@src/components/Context/ChatsContext"
import { FileTextIcon, ImageIcon, VideoIcon } from "lucide-react";

function getInitials(name = "") {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return initials.toUpperCase();
}


const CurrentChannel = ({ channelName, channelId, chennelMembers, unseen, setIsChannelExist, lastMsgOfChannle }: any) => {
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
    const allMemberNumbers = chennelMembers.map((member: any) => member.phoneNo)

    // const receiverNumbers = allMemberNumbers.filter((number: any) => number != import.meta.env.VITE_SENDER_PHONENO)
    const currentChannel = {
      channelName,
      channelId,
      chennelMembers: allMemberNumbers,
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
      <div className="flex-1 min-w-0 items-center gap-y-1">
        <div className="flex items-center justify-between">
          <div className="font-normal text-lg truncate">{channelName}</div>
          {unseenMessageCount !== 0 ?
            <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>
              {unseenMessageCount}
            </div> : <></>}
        </div>
        <div className="flex items-center justify-between">
          {
            lastMsgOfChannle?.textMessage ? (
              <p className="text-sm text-gray-500 truncate">
                {lastMsgOfChannle.textMessage}
              </p>
            ) : (
              <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                {lastMsgOfChannle?.messageType === 'image' ? (
                  <>
                    <ImageIcon size={14} className="text-gray-500" />
                    Photo
                  </>
                ) : lastMsgOfChannle?.messageType === 'video' ? (
                  <>
                    <VideoIcon size={14} className="text-gray-500" />
                    Video
                  </>
                ) : lastMsgOfChannle?.messageType === 'document' ? (
                  <>
                    <FileTextIcon size={14} className="text-gray-500" />
                    Document
                  </>
                ) : (
                  'No messages yet'
                )}
              </p>
            )
          }
          {lastMsgOfChannle?.createdAt && (
            <p className="text-xs text-gray-400">
              {(() => {
                const msgDate = new Date(lastMsgOfChannle?.createdAt);
                const now = new Date();

                const isToday =
                  msgDate.getDate() === now.getDate() &&
                  msgDate.getMonth() === now.getMonth() &&
                  msgDate.getFullYear() === now.getFullYear();

                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);

                const isYesterday =
                  msgDate.getDate() === yesterday.getDate() &&
                  msgDate.getMonth() === yesterday.getMonth() &&
                  msgDate.getFullYear() === yesterday.getFullYear();

                if (isToday) {
                  // show only time (e.g. "02:49 PM")
                  return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (isYesterday) {
                  return "Yesterday";
                } else {
                  // show date like "15 Oct 2025"
                  return msgDate.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
                }
              })()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrentChannel
