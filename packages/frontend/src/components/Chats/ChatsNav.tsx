import { Search } from 'lucide-react'
import { useContext } from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { ChatsContext } from '../Context/ChatsContext'

const ChatsNav = () => {
    const { chatDetails } : any = useContext(ChatsContext)
    return (
        <div className="px-4 py-1 bg-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-4 p-[7px]">
                <img className="w-12 h-12 p-0.5 object-cover rounded-full" src={chatDetails.profileImg} alt="cdsdcsd" />
                <div className="font-bold tex-lg">{chatDetails.contactName}</div>
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
