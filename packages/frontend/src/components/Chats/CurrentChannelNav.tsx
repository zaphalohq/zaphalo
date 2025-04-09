import { useContext } from 'react'
import { ChatsContext } from '../Context/ChatsContext'
import { FiEdit2 } from 'react-icons/fi'

const CurrentChannelNav = () => {
    const { chatsDetails }: any = useContext(ChatsContext)
    const { setIsUpdateChannelName }: any = useContext(ChatsContext)

    return (
        <div className="px-4 py-1 pr-4 bg-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-4 p-[7px]">
                {chatsDetails.profileImg ?
                    <img className="w-12 h-12 p-0.5 object-cover rounded-full" src={chatsDetails.profileImg} alt="cdsdcsd" />
                    : <div className='w-12 h-12 p-0.5 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-500'>{chatsDetails.channelName.slice(0, 1).toUpperCase()}</div>
                }
                <div className="font-bold tex-lg">{chatsDetails.contactName ? chatsDetails.contactName : chatsDetails.channelName}</div>
            </div>
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
