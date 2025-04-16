import { useContext, useEffect, useRef, useState } from 'react'
import { ChatsContext } from '../Context/ChatsContext'
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi'

const CurrentChannelNav = () => {
    const { chatsDetails }: any = useContext(ChatsContext)
    const { setIsUpdateChannelName }: any = useContext(ChatsContext)
    const [isChannelDetails, setIsChannelDetails] = useState(false)
    const menuref = useRef<HTMLDivElement | null>(null);
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

      const { setIsChatOpen } : any = useContext(ChatsContext)

    return (
        <div className="px-4 py-1 pr-4 bg-stone-200 flex items-center justify-between">
            <div onClick={() => setIsChannelDetails(!isChannelDetails)} className="flex items-center hover:cursor-pointer gap-4 p-[7px]">
            <div onClick={() => setIsChatOpen(false)} className='text-2xl md:hidden'><FiArrowLeft /></div>
                {chatsDetails.profileImg ?
                    <img className="w-12 h-12 p-0.5 object-cover rounded-full" src={chatsDetails.profileImg} alt="cdsdcsd" />
                    : <div className='w-12 h-12 p-0.5 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-500'>{chatsDetails.channelName.slice(0, 1).toUpperCase()}</div>
                }
                <div className="font-bold tex-lg">{chatsDetails.contactName ? chatsDetails.contactName : chatsDetails.channelName}</div>
            </div>
            {isChannelDetails ? <div ref={menuref} className='absolute top-15 left-90 z-11 w-[30vh] bg-white py-4 p-2 rounded'>
                <div className='text-lg font-semibold text-center rounded  p-2'>Channel Details</div>
                <ul >
                    <li className='w-full bg-gray-200 px-4 p-2 border-b border-gray-300'>
                        Name :  
                        <span className='font-semibold text-violet-700'>{`  ${chatsDetails.channelName}`}</span></li>
                    <li className='w-full bg-gray-200 px-4 p-2'>
                        phone no :
                        <span className='font-semibold text-violet-700'>{`  ${chatsDetails.receiverId[0]}`} </span>
                    </li>
                </ul>
            </div> : <></> }
            <div className="flex gap-4 text-[1.3rem] ">
                {/* <button className="p-2 cursor-pointer rounded hover:bg-stone-300 text-lg"></button> */}
                <button onClick={() => setIsUpdateChannelName(true)}
                    className="p-2 cursor-pointer rounded bg-stone-300 hover:bg-stone-100 text-lg text-violet-600"><FiEdit2 /></button>
                {/* {/* <div className='text-violet-600'><FiEdit2 /></div> */}
            </div>
            {/* ------------------------this is delete if we want to delete channel now it is commented out */}
            {/* { isDeleteUpdateVis ?
                <div className='absolute right-14 top-12 rounded-sm  bg-white z-11 py-2'>
                <ul onClick={() => {
                    setIsUpdateChannelName(true)
                    }} className=' text-lg font-semibold'>
                    <ul className='flex gap-4 items-center bg-gray-100 px-4 p-2  border-b border-stone-300 cursor-pointer hover:bg-gray-300'>
                        <li className='text-red-500'><FiTrash2 /></li>
                    </ul>
                </ul>
            </div> : <></>} */}
        </div>
    )
}

export default CurrentChannelNav