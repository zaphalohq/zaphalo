import { FiEdit, FiList, FiPlus, FiUsers } from "react-icons/fi"
import { SearchWhite } from "../UI/Search"
import { useEffect, useRef, useState } from "react"
import ContactList from "./ContactsArea"
import CreateContacts from "./CreateContacts"
import { useQuery } from "@apollo/client"
import { findAllChannel } from "../../pages/Mutation/Chats"
import ChannelDetails from "./channelDetails"


const ChatsSide = () => {

  //-----------------------visiability of contacts----------------------------------
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const HandleNewChatVisiablity = () => setIsNewChatOpen(!isNewChatOpen)
  const [isCreateContactVis, setIsCreateContactVis] = useState(false);
  const HandleCreateContactVis = () => setIsCreateContactVis(!isCreateContactVis)

  const { data, refetch } = useQuery(findAllChannel)
  const [ allChannel, setAllChannel ] = useState([{
    channelName : '',
    createUser : '',
    id : '',
    createdAt : '',
    writeDate : '',
    memberIds : '',
    writeUser : ''
  }])
  const FetchAllChannel = async () => {
    await refetch()
    if( data && data.findAllChannel )
       setAllChannel(data.findAllChannel)    

  }

useEffect(() => {
  FetchAllChannel()
  console.log(allChannel, 'thisi ');

}, [data])


// const modalRef = useRef(null);
//   useEffect(() => {
//     const handle = (event : any) => {
//       console.log("...........");
      
//       if(modalRef.current && !(modalRef.current as any).contains(event.target as Node)){
//         setIsNewChatOpen(false)
//         // HandleNewChatVisiablity()
//       }
//     }

//     document.addEventListener("mousedown", handle)

//     return document.removeEventListener("mousedown", handle)

//   },)


  return (
    <div>
      <div  className='bg-stone-50 stikey  h-[calc(100vh-40px)] inset-shadow-sm '>
        {/* this is the upper on left side of chats */}
        <div className='flex justify-between p-4.5 bg-stone-200'>
          <h2 className='text-xl font-bold text-stone-950'>Chats</h2>
          <div className='relative flex gap-2 text-lg items-center'>
            {/* -------------this is button on sidebar with new contacts list----------- */}
            <button onClick={HandleNewChatVisiablity}  className='p-2 hover:bg-stone-300 rounded cursor-pointer'><FiEdit /></button>
            <div>
            {isNewChatOpen ? <ContactList  HandleCreateContactVis={HandleCreateContactVis} HandleNewChatVisiablity={HandleNewChatVisiablity} /> : null}
            </div>
            {isCreateContactVis ? <CreateContacts HandleCreateContactVis={HandleCreateContactVis} /> : null}
            <button className='p-2 hover:bg-stone-300 rounded cursor-pointer'><FiList /></button>
          </div>
        </div>
        {/* this is the search of left side of chats */}
        <div className='p-3  border-b border-stone-300'>
          <SearchWhite />
        </div>
        <div className="overflow-y-scroll h-[calc(100vh-162px)]">
          {allChannel.map((data, index) => <ChannelDetails key={index} channelId={data.id} memberIds={data.memberIds} channelName={data.channelName} lastmsg="" />)}
        </div>
      </div>
    </div>
  )
}

export default ChatsSide
