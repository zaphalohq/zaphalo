import { Search } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { ChatsContext } from '../Context/ChatsContext'

const ChatsNav = () => {
    const { chatsDetails, setChatsDetails }: any = useContext(ChatsContext)
    // useState()
    // useEffect(() => {
    //     setChatsDetails(chatsDetails)
    // }, [])
    return (
        <div className="px-4 py-1 bg-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-4 p-[7px]">
                {chatsDetails.profileImg ?
                    <img className="w-12 h-12 p-0.5 object-cover rounded-full" src={chatsDetails.profileImg} alt="cdsdcsd" />
                    : <div className='w-12 h-12 p-0.5 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-500'>{chatsDetails.channelName.slice(0, 1).toUpperCase()}</div>
                }
                <div className="font-bold tex-lg">{chatsDetails.contactName ? chatsDetails.contactName : chatsDetails.channelName}</div>
            </div>
            <div className="flex gap-4">
                <Search />
                {/* <button className="p-2 cursor-pointer rounded hover:bg-stone-300 text-lg"></button> */}
                <button className="p-2 cursor-pointer rounded hover:bg-stone-300 text-lg"><FaEllipsisVertical /></button>
            </div>
        </div>
    )
}

export default ChatsNav
