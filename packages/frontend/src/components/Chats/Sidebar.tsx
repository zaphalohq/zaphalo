import { FiEdit, FiList } from "react-icons/fi"
import { useEffect, useRef, useState } from "react"
import ContactList from "./ContactsArea"
import CreateContacts from "./CreateContacts"
import ChannelLists from "./ChannelLists"
import SelectWaAccount from "@src/modules/whatsapp/components/account/SelectWaAccount"
import { SearchWhite } from "@components/UI/Search"


const ChatsSide = ({ setIsChatOpen }: any) => {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const HandleNewChatVisiablity = () => setIsNewChatOpen(!isNewChatOpen)
  const [isCreateContactVis, setIsCreateContactVis] = useState(false);
  const HandleCreateContactVis = () => setIsCreateContactVis(!isCreateContactVis)
  const [isInstantsVis, setIsInstantsVis] = useState(false)

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
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className='sticky inset-shadow-sm z-11'>
        <div className='flex justify-between p-4.5 bg-white border-b border-gray-300 '>
          <h2 className='text-xl font-bold text-stone-950'>Chats</h2>
          <div className='relative flex gap-2 text-lg items-center'>
            <button onClick={HandleNewChatVisiablity} className='p-2 hover-light rounded cursor-pointer'><FiEdit /></button>
            <div className="menuref" ref={modalRef}>
              {isNewChatOpen ?
                <ContactList HandleCreateContactVis={HandleCreateContactVis} HandleNewChatVisiablity={HandleNewChatVisiablity} /> 
                 : null} 
            </div>
            {isCreateContactVis ? <CreateContacts HandleCreateContactVis={HandleCreateContactVis} /> : null}
            <button onClick={() => setIsInstantsVis(!isInstantsVis)} className='p-2 hover-light rounded cursor-pointer'><FiList /></button>
            <div className="menuref1" ref={modalRef1}>
              {isInstantsVis ?
                <SelectWaAccount/>
                 : null} 
            </div>
          </div>
        </div>
        <div className='px-5 py-4'>
          <SearchWhite HandleSearch={(event: any) => setSearchChannel(event.target.value)} />
        </div>
        <div className=" max-h-[79vh] min-h-[79vh] bg-gray-50 overflow-y-scroll">
          <div className="px-4 pt-4 font-bold text-gray-500">Last chats</div>
          <ChannelLists searchChannel={searchChannel} />
        </div>
      </div>
    </aside>
  )
}

export default ChatsSide