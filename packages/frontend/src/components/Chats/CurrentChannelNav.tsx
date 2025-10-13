import { FiArrowLeft, FiEdit2 } from 'react-icons/fi'
import { useContext, useEffect, useRef, useState } from 'react'
import { ChatsContext } from '@components/Context/ChatsContext'
import { useQuery } from '@apollo/client'

const CurrentChannelNav = () => {
  const { chatsDetails }: any = useContext(ChatsContext)
  const { setIsUpdateChannelName }: any = useContext(ChatsContext)
  const [isChannelDetails, setIsChannelDetails] = useState(false)
  const menuref = useRef<HTMLDivElement | null>(null);
  const { setIsChatOpen }: any = useContext(ChatsContext)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuref.current && !menuref.current.contains(event.target as Node)) {
        setIsChannelDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedPhoneNo, setSelectedPhoneNo ] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
      {chatsDetails ? ( <div onClick={() => setIsChannelDetails(!isChannelDetails)} className="flex items-center space-x-4">
        <div onClick={() => setIsChatOpen(false)} className='text-2xl md:hidden'>
          <FiArrowLeft />
        </div>
        {chatsDetails.profileImg ?
        <img className="w-8 h-8 p-0.5 object-cover rounded-full" src={chatsDetails.profileImg} alt="cdsdcsd" />
        : <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">{chatsDetails?.channelName?.slice(0, 1).toUpperCase()}</div>
      }
      <div className="font-semibold">{chatsDetails.contactName ? chatsDetails.contactName : chatsDetails.channelName}</div>
    </div>) : (
    <div className="text-gray-500">No contact selected</div>
    )}
    {isChannelDetails ? <div ref={menuref} className='absolute top-15 left-90 z-11 w-[30vh] bg-white py-4 p-2 rounded'>
      <div className='text-lg font-semibold text-center rounded  p-2'>Channel Details</div>
      <ul >
        <li className='w-full bg-gray-200 px-4 p-2 border-b border-gray-300'>
          Name :
          <span className='font-semibold text-violet-700'>{`  ${chatsDetails.channelName}`}</span></li>
          <li className='w-full bg-gray-200 px-4 p-2'>
            phone no :
            <span className='font-semibold text-violet-700'>{`  ${JSON.stringify(chatsDetails.receiverId.find((number : number) => number !== selectedPhoneNo))}`} </span>
          </li>
        </ul>
      </div> : <></>}
      <div className="flex gap-4 text-[1.3rem] ">
        <button onClick={() => setIsUpdateChannelName(true)}
          className="p-2 cursor-pointer rounded hover:bg-gray-300 text-base font-normal text-green-500 hover:text-green-600
 transition-colors duration-200">
          <FiEdit2 />
        </button>
      </div>
    </div>  
    )
}

export default CurrentChannelNav