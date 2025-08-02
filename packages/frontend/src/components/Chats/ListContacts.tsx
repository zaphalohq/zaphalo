import { useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ChatsContext } from '@components/Context/ChatsContext'
import { findOrCreateChannel, DeleteContact } from '@src/generated/graphql'

const ListContacts = ({ contactName, phoneNo, HandleNewChatVisiablity, profileImg }: any) => {
    const { chatsDetails, setChatsDetails }: any = useContext(ChatsContext)
    const [fetchNow, setFetchNow] = useState(false)
    // const memberIds = [ phoneNo]
    const [FindOrCreateChannel, { data, loading, error }] = useMutation(findOrCreateChannel)
    const HandleCurrentContact = async () => {
        const channel = await FindOrCreateChannel({ variables: { phoneNo: `${phoneNo}` } })
        const currentChannel = channel.data.findExistingChannelByPhoneNoOrCreateChannel;
        if (currentChannel) {
            // const existChannel = data.findExistingChannelByPhoneNoOrCreateChannel
            setChatsDetails({
                channelName: currentChannel.channelName,
                profileImg,
                channelId: currentChannel.id,
                memberIds: [phoneNo],
                receiverId: [phoneNo]
            })

            // localStorage.setItem('chatsDetails', JSON.stringify({
            //     channelName: existChannel.channelName,
            //     profileImg,
            //     receiverId: [phoneNo],
            //     channelId: existChannel.id,
            //     memberIds: [phoneNo],
            // }))
        } else {
            setChatsDetails({
                channelName: contactName,
                profileImg,
                receiverId: [phoneNo],
                channelId: '',
                memberIds: [phoneNo],
            })

            // localStorage.setItem('chatsDetails', JSON.stringify({
            //     channelName: contactName,
            //     profileImg,
            //     receiverId: [phoneNo],
            //     channelId: '',
            //     memberIds: [phoneNo],
            // }))
        }

        HandleNewChatVisiablity()
        setFetchNow(false)
    }

    const { setIsChatOpen }: any = useContext(ChatsContext);

    const [deleteContact] = useMutation(DeleteContact)
    const HandleDeleteContact = async () => {
        try {
            await deleteContact({
                variables: {
                }
            })
        } catch (err) {
            console.error("error from HandleDeleteInstants", err)
        }
    }

    return (
        <div>

            <div onClick={() => {
                setFetchNow(true)
                HandleCurrentContact();
                setIsChatOpen(true);
            }} className="bg-gray-100 cursor-pointer hover-light w-full  flex gap-3 px-4 items-center p-2.5 border-b border-gray-200">
                {profileImg ?
                    <img className='w-11 h-11 object-cover rounded-full'
                        src={profileImg} alt="dfssdf" />
                    : <div className="w-11 h-11 bg-blue-200 rounded-full 
                       flex justify-center text-blue-500 font-bold text-lg 
                       items-center">
                        {contactName?.slice(0, 1).toUpperCase()}
                    </div>
                }
                <div className='flex flex-col'>
                    <span className="font-semibold">{contactName}</span>
                    <div className='text-sm font-medium text-gray-700'>{phoneNo}</div>
                </div>
            </div>

        </div>
    )
}

export default ListContacts
