import { useContext } from 'react'
import { ChatsContext } from '../Context/ChatsContext'
import { useQuery } from '@apollo/client'
import { findChannelByPhoneNo } from '../../pages/Mutation/Chats'
import { setItem } from '../utils/localstorage'

const ListContacts = ({ contactName, phoneNo, HandleNewChatVisiablity, profileImg }: any) => {
    const { chatsDetails, setChatsDetails }: any = useContext(ChatsContext)
    const memberIds: any = [phoneNo, import.meta.env.VITE_SENDER_PHONENO]
    const { data, loading, error } = useQuery(findChannelByPhoneNo, {
        variables: { memberIds: JSON.stringify(memberIds) },
        skip: !memberIds && memberIds.length < 2,
    })

    const HandleCurrentContact = () => {
        if (data && data?.findExistingChannelByPhoneNo) {
            const existChannel = data.findExistingChannelByPhoneNo
            setChatsDetails({
                channelName: existChannel.channelName,
                profileImg,
                channelId: existChannel.id,
                memberIds: memberIds,
                receiverId: [phoneNo]
            })

            console.log(chatsDetails);
            
            setItem('chatsDetails', {
                channelName: existChannel.channelName,
                profileImg,
                receiverId: [phoneNo],
                channelId: existChannel.id,
                memberIds: memberIds,
                    })
        } else {
        setChatsDetails({
            channelName: contactName,
            profileImg,
            receiverId: [phoneNo],
            channelId: '',
            memberIds: memberIds,
        })

        setItem('chatsDetails', {
            channelName: contactName,
            profileImg,
            receiverId: [phoneNo],
            channelId: '',
            memberIds: memberIds,
        })
        }

        HandleNewChatVisiablity()

    }

    return (
        <div onClick={HandleCurrentContact} className="bg-gray-100 cursor-pointer hover:bg-stone-300 w-full  flex gap-3 px-4 items-center p-2 border-b border-gray-200">
            {profileImg ?
                <img className='w-11 h-11 object-cover rounded-full' src={profileImg} alt="dfssdf" />
                : <div className="w-11 h-11 bg-blue-200 rounded-full flex justify-center text-blue-500 font-bold text-lg items-center">{contactName.slice(0, 1).toUpperCase()}</div>
            }
            <span className="font-semibold">{contactName}</span>
        </div>
    )
}

export default ListContacts
