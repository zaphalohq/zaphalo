import { useContext } from 'react'
import { ChatsContext } from '../Context/ChatsContext'

const ListContacts = ({contactName,phoneNo, HandleNewChatVisiablity, profileImg} : any) => {
    const { setChatDetails } : any = useContext(ChatsContext)
    return (
        <div onClick={() => {
            setChatDetails({
                contactName,
                profileImg,
                phoneNo
            })
            HandleNewChatVisiablity()
        }
            } className="bg-gray-100 cursor-pointer hover:bg-stone-300 w-full  flex gap-3 px-4 items-center p-2 border-b border-gray-200">
            <img className='w-11 h-11 object-cover rounded-full' src={profileImg} alt="dfssdf" />
            <span className="font-semibold">{contactName}</span>
        </div>
    )
}

export default ListContacts
