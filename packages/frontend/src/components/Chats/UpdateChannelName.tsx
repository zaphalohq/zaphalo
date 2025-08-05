import { FormEvent, useContext, useState } from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import CloseButton from '@components/UI/CloseButton'
import InputLabel from '@components/UI/InputLabel'
import SubmitButton from '@components/UI/SubmitButton'
import { updateChannelNameById } from '@src/generated/graphql'
import { ChatsContext } from '@components/Context/ChatsContext'

const UpdateChannelName = () => {
  const { isUpdateChannelName, setIsUpdateChannelName }: any = useContext(ChatsContext)
  const [channelNameChange, setChannelNameChange] = useState("")
  const [UpdateChannel] = useMutation(updateChannelNameById)
  const { chatsDetails } : any = useContext(ChatsContext)
  
  const HandleUpdateChannelName = async (event : FormEvent) => {
    // localStorage.setItem("chatsDetails", JSON.stringify({
    //   ...chatsDetails,
    //   channelName : channelNameChange
    // }))
    
    try {
      const response = await UpdateChannel({ variables : {
        channelId: chatsDetails.channelId,
        updatedValue: channelNameChange
      } });
      setIsUpdateChannelName(false)
      setChannelNameChange("")
    } catch (err) {
      console.error('Error update channel name:', err);
    }
  }

  return (
    <>
      { isUpdateChannelName ? <div className="absolute z-11 inset-0  md:h-100% bg-stone-900/30 " >
        <CloseButton onClick={() => setIsUpdateChannelName(false) } 
                    right="md:right-120 right-4" top="top-60" />
        <form onSubmit={HandleUpdateChannelName} className="absolute top-[35%]  md:right-[35%] md:w-[30rem] bg-stone-100 p-10 rounded flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center">Update Channel Name</h2>
          <div className='text-lg text-violet-600'>Current Channel Name : {chatsDetails.channelName}</div>
          <InputLabel type="text" name='update channel name' value={channelNameChange} HandleInputChange={(e : any) => setChannelNameChange(e.target.value)} title="Channel Name" placeholder="updated channel name" />
          <SubmitButton type="submit" Icon={FaSyncAlt} title='Submit' />
        </form>
      </div> : <></>}
    </>
  )
}

export default UpdateChannelName
