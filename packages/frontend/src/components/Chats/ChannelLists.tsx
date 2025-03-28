import { useQuery } from "@apollo/client"
import { findAllChannel } from "../../pages/Mutation/Chats"
import { useEffect, useState } from "react"
import ChannelList from "./CurrentChannel"

const ChannelLists = () => {
    const { data, refetch } = useQuery(findAllChannel)
    const [ allChannel, setAllChannel ] = useState([{
      channelName : '',
      id : '',
      contacts : [{
        phoneNo : null,
        id : ''
      }]
    }])
    const FetchAllChannel = async () => {
      await refetch()
      if( data && data.findAllChannel )
        setAllChannel(data.findAllChannel)      
  
    }
  
  useEffect(() => {
    FetchAllChannel()
  }, [data])



  return (
    <div className="overflow-y-scroll h-[calc(100vh-162px)]">
    {allChannel.map((data, index) => <ChannelList key={index} channelId={data.id}  channelName={data.channelName} memberIds={data.contacts} lastmsg="" />)}
  </div>
  )
}

export default ChannelLists
