import { useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import CurrentChannel from "./CurrentChannel"
import { findAllChannel } from "@src/generated/graphql"
import { ChatsContext } from "@components/Context/ChatsContext"

const ChannelLists = ({ searchChannel }: any) => {
  const { data, refetch, loading } = useQuery(findAllChannel)
  const [allChannel, setAllChannel] = useState([{
    channelName: 'refresh it',
    id: '',
    contacts: [{
      phoneNo: null,
      id: ''
    }],
    messages: []
  }])

  const { isNewChannelCreated, setIsNewChannelCreated }: any = useContext(ChatsContext)
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

  const { myCurrentMessage }: any = useContext(ChatsContext)
  const { chatsDetails }: any = useContext(ChatsContext)
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
          <CurrentChannel key={index}
            channelId={channel.id} channelName={channel.channelName}
            memberIds={channel.contacts}
            unseen={channel.messages.length}
          />)}
    </div>
  )
}

export default ChannelLists
