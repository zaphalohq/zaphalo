import { useQuery } from "@apollo/client"
import { findAllChannel } from "../../pages/Mutation/Chats"
import { useContext, useEffect, useState } from "react"
import CurrentChannel from "./CurrentChannel"
import { ChatsContext } from "../Context/ChatsContext"

const ChannelLists = ({ searchChannel }: any) => {
  //---------------FindALLChannel---------------------------------------
  const { data, refetch, loading } = useQuery(findAllChannel)
  const [allChannel, setAllChannel] = useState([{
    channelName: '',
    id: '',
    contacts: [{
      phoneNo: null,
      id: ''
    }],
    messages: []
  }])

  const { isNewChannelCreated, setIsNewChannelCreated }: any = useContext(ChatsContext)
  const FetchAllChannel = async () => {
    if(!loading){
    await refetch()
 
      setAllChannel(data.findAllChannel)
      console.log(data.findAllChannel,"findall....................................");
      
}
  }

  useEffect(() => {
    FetchAllChannel()
  }, [data])

  
  useEffect(() => {
    console.log('...............isNewChannelCreated...................', isNewChannelCreated);
    if(isNewChannelCreated){
      console.log('.............isNewChannelCreated.....................', isNewChannelCreated);
      
    FetchAllChannel()
    setIsNewChannelCreated(false)
    }
  }, [isNewChannelCreated])

  //------------it put the channel first when new message arrives------------
  const { myCurrentMessage }: any = useContext(ChatsContext)
  const { chatsDetails }: any = useContext(ChatsContext)
  useEffect(() => {
    // Guard clauses to prevent unnecessary execution
    if (!myCurrentMessage || !chatsDetails?.channelId) return;

    const channelToMove = allChannel.find(
      (channel) => channel.id === chatsDetails.channelId
    );

    // If no matching channel is found, do nothing
    if (!channelToMove) return;

    // Reorder channels: move the matched channel to the top
    const reorderedChannels = [
      channelToMove,
      ...allChannel.filter((channel) => channel.id !== chatsDetails.channelId),
    ];

    // Update state with reordered list or fallback to default
    setFilteredChannels(reorderedChannels.length > 0 ? reorderedChannels : allChannel);

  }, [myCurrentMessage]);


  const [filteredChannels, setFilteredChannels] = useState(allChannel); // New state for filtered results
  useEffect(() => {
    
    if (!searchChannel) {
      setFilteredChannels(allChannel); // Reset to all channels if search is empty
      return;
    }
    const searchedChannels = allChannel.filter((channel: any) =>
      channel.channelName
        .toLowerCase()
        .startsWith(searchChannel.toLowerCase() || "") // Search by first character
    );
    setFilteredChannels(searchedChannels);
  }, [searchChannel, allChannel])




  return (
    <div>
      {/* ---------------------Display AllCurrrentChannel-----h-[calc(100vh-200px)]----------------- */}
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
