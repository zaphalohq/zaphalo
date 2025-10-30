import { useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import CurrentChannel from "./CurrentChannel"
import { findAllChannel } from "@src/generated/graphql"
import { ChatsContext } from "@components/Context/ChatsContext"
import { channel } from "diagnostics_channel"

const ChannelLists = ({ searchChannel }: any) => {
  const { isNewChannelCreated,
    setIsNewChannelCreated,
    myCurrentMessage,
    chatsDetails }: any = useContext(ChatsContext)
  const { data, refetch, loading } = useQuery(findAllChannel)
  const [allChannel, setAllChannel] = useState([{
    channelName: '',
    id: '',
    chennelMembers: [{
      phoneNo: null,
      id: ''
    }],
    messages: []
  }])


  const FetchAllChannel = async () => {
    if (!loading) {
      await refetch()
      setAllChannel(data.findAllChannel)
    }
  }

  useEffect(() => {
    FetchAllChannel()
  }, [data])


  useEffect(() => {
    if (isNewChannelCreated) {
      FetchAllChannel()
      setIsNewChannelCreated(false)
    }
  }, [isNewChannelCreated])

  useEffect(() => {
    if (!myCurrentMessage || !chatsDetails?.channelId) return;
    const channelToMove = allChannel.find(
      (channel) => channel.id === chatsDetails.channelId
    );

    if (!channelToMove) return;
    const reorderedChannels = [
      channelToMove,
      ...allChannel.filter((channel) => channel.id !== chatsDetails.channelId),
    ];

    setFilteredChannels(reorderedChannels.length > 0 ? reorderedChannels : allChannel);

  }, [myCurrentMessage]);


  useEffect(() => {
    if (data && !loading) {
      const isChannelExist = allChannel.findIndex((channel: any) => {
        if (channel.id === chatsDetails.channelId) {
          return channel
        }
      })

      if (isChannelExist === -1) {
        setAllChannel((prevChannel) => [{
          channelName: chatsDetails.channelName,
          id: chatsDetails.channelId,
          chennelMembers: [{
            phoneNo: null,
            id: ''
          }],
          messages: []
        }, ...prevChannel])
      }
    }
  }, [chatsDetails])


  const [filteredChannels, setFilteredChannels] = useState(allChannel);
  
  useEffect(() => {

    if (!searchChannel) {
      setFilteredChannels(allChannel);
      return;
    }
    const searchedChannels = allChannel.filter((channel: any) =>
      channel.channelName
        .toLowerCase()
        .startsWith(searchChannel.toLowerCase() || "")
    );
    setFilteredChannels(searchedChannels);
  }, [searchChannel, allChannel])


  return (
    <div>
      {filteredChannels
        .map((channel, index) =>
          <CurrentChannel
            key={channel.id}
            channelId={channel.id}
            channelName={channel.channelName}
            // isActive={channel.id === selectedContactId}
            chennelMembers={channel.channelMembers}
            unseen={channel.messages.length}
            lastMsgOfChannle={channel.lastMsgOfChannle}
          />)}
    </div>
  )
}

export default ChannelLists
