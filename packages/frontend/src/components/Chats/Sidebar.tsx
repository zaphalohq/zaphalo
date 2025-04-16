import { FiEdit, FiList } from "react-icons/fi"
import { SearchWhite } from "../UI/Search"
import { useEffect, useRef, useState } from "react"
import ContactList from "./ContactsArea"
import CreateContacts from "./CreateContacts"
import ChannelLists from "./ChannelLists"


const ChatsSide = ({ setIsChatOpen }: any) => {

  //-----------------------visiability of contacts----------------------------------
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const HandleNewChatVisiablity = () => setIsNewChatOpen(!isNewChatOpen)
  const [isCreateContactVis, setIsCreateContactVis] = useState(false);
  const HandleCreateContactVis = () => setIsCreateContactVis(!isCreateContactVis)

  //----------Handle the vidiability of contacts when user click out side of the component---------
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsNewChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [searchChannel, setSearchChannel] = useState("")
  // min-h-full
  return (
    <div>
      <div className='sticky inset-shadow-sm z-11'>
        {/* this is the upper on left side of chats */}
        <div className='flex justify-between p-4.5 bg-stone-200'>
          <h2 className='text-xl font-bold text-stone-950'>Chats</h2>
          <div className='relative flex gap-2 text-lg items-center'>
            {/* -------------this is button on sidebar with new contacts list----------- */}
            <button onClick={HandleNewChatVisiablity} className='p-2 hover:bg-stone-300 rounded cursor-pointer'><FiEdit /></button>
            <div className="menuref" ref={modalRef}>
              {isNewChatOpen ?
                <ContactList HandleCreateContactVis={HandleCreateContactVis} HandleNewChatVisiablity={HandleNewChatVisiablity} /> 
                 : null} 
            </div>
            {isCreateContactVis ? <CreateContacts HandleCreateContactVis={HandleCreateContactVis} /> : null}
            <button className='p-2 hover:bg-stone-300 rounded cursor-pointer'><FiList /></button>
          </div>
        </div>
        {/* this is the search of left side of chats */}
        <div className='p-3  border-b border-stone-300'>
          <SearchWhite HandleSearch={(event: any) => setSearchChannel(event.target.value)} />
        </div>
        <div className=" max-h-[79vh] min-h-[79vh] bg-gray-50 overflow-y-scroll">
          <ChannelLists searchChannel={searchChannel} />
        </div>
      </div>
    </div>
  )
}

export default ChatsSide