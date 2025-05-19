import React, { useState } from 'react'
import SubmitButton from '@components/UI/SubmitButton'
import { FiRefreshCw } from 'react-icons/fi';
import { useMutation } from '@apollo/client';
import { GenerateInviteLink } from './Mutation/Chats';
import { getItem } from '@components/utils/localStorage';

const Workspace = () => {
  const [copied, setCopied] = useState(false);
  const [InviteLink,{ data }] = useMutation(GenerateInviteLink);
  const [ inviteLink, setInviteLink ] = useState("")


  const HandleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset copied after 2s
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const HandleInviteLink = async () => {
    try{
      const workspaceIds = getItem("workspaceIds")
      
       const inviteLinkRes = await InviteLink({
        variables : { 
          workspaceId : workspaceIds && workspaceIds[0],
        } })
        await data
       console.log(inviteLinkRes.data.generateWorkspaceInvitation);
       setInviteLink(inviteLinkRes.data.generateWorkspaceInvitation);
    } catch (err) {
      console.error('Error during invitlink', err)
    }
  }

  return (
    <div className='bg-white flex md:flex-row p-4 mt-2 rounded items-center gap-4  flex-col'>
      <div className='w-full flex rounded-2xl'>
        <input className='p-4 border-none focus:outline-none focus:ring-0 focus:border-none w-full bg-gray-200 text-blue-700' type="text" name="" id="" defaultValue={inviteLink} />
        <button onClick={HandleCopy} className='p-4 bg-gray-300 hover:bg-gray-400 cursor-pointer text-stone-900 font-medium'>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
      <div>
      <SubmitButton title="Generate Invite" type='button' onClick={HandleInviteLink} Icon={FiRefreshCw} />
      </div>
    </div>
  )
}

export default Workspace
