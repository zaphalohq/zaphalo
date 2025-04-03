import { useQuery } from "@apollo/client"
import { findAllChannel } from "../../pages/Mutation/Chats"
import { useContext, useEffect, useState } from "react"
import ChannelList from "./CurrentChannel"
import { ChatsContext } from "../Context/ChatsContext"

const ChannelLists = () => {
  //---------------FindALLChannel---------------------------------------
  const { data, refetch, loading } = useQuery(findAllChannel)
  const [allChannel, setAllChannel] = useState([{
    channelName: '',
    id: '',
    contacts: [{
      phoneNo: null,
      id: ''
    }]
  }])
  const FetchAllChannel = async () => {
    await refetch()
    if (data && data.findAllChannel)
      setAllChannel(data.findAllChannel)

  }

  const [isChannelExist, setIsChannelExist] = useState(0)
  useEffect(() => {
    FetchAllChannel()
  }, [data, isChannelExist])




  const { myCurrentMessage }: any = useContext(ChatsContext)
  const { chatsDetails }: any = useContext(ChatsContext)
  useEffect(() => {
    const channelToMove = allChannel.find(channel => channel.id == chatsDetails.channelId)
    const reorderedChannels: any = []
    reorderedChannels.push(channelToMove)
    allChannel.forEach((channel) => {
      // Skip the channel that we want to move to the first position
      if (channel.id !== chatsDetails.channelId) {
        reorderedChannels.push(channel);
      }
    })
    setAllChannel(reorderedChannels && reorderedChannels[0] ? reorderedChannels : [{
      channelName: '',
      id: '',
      contacts: [{
        phoneNo: null,
        id: ''
      }]
    }])
  }, [myCurrentMessage])



  return (
    <div className="overflow-y-scroll h-[calc(100vh-200px)]">
      {/* ---------------------Display AllCurrrentChannel---------------------- */}
      {allChannel.map((channel, index) => <ChannelList key={index} channelId={channel.id} channelName={channel.channelName} memberIds={channel.contacts} setIsChannelExist={setIsChannelExist} isChannelExist={isChannelExist} />)}
    </div>
  )
}

export default ChannelLists
