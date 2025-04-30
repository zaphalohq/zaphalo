import { FiEdit, FiList } from "react-icons/fi"
import { SearchWhite } from "../UI/Search"
import { useEffect, useRef, useState } from "react"
import ContactList from "./ContactsArea"
import CreateContacts from "./CreateContacts"
import ChannelLists from "./ChannelLists"
import AllInstants from "./AllInstants"


const ChatsSide = ({ setIsChatOpen }: any) => {

  //-----------------------visiability of contacts----------------------------------
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const HandleNewChatVisiablity = () => setIsNewChatOpen(!isNewChatOpen)
  const [isCreateContactVis, setIsCreateContactVis] = useState(false);
  const HandleCreateContactVis = () => setIsCreateContactVis(!isCreateContactVis)
  const [isInstantsVis, setIsInstantsVis] = useState(false)

  //----------Handle the vidiability of contacts when user click out side of the component---------
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalRef1 = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsNewChatOpen(false);
      }

      if (modalRef1.current && !modalRef1.current.contains(event.target as Node)) {
        setIsInstantsVis(false)
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
            <button onClick={() => setIsInstantsVis(!isInstantsVis)} className='p-2 hover:bg-stone-300 rounded cursor-pointer'><FiList /></button>
            <div className="menuref1" ref={modalRef1}>
              {isInstantsVis ?
                <AllInstants /> 
                 : null} 
            </div>
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