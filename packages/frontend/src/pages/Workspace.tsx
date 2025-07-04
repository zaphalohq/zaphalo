import React, { useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi';
import { useMutation } from '@apollo/client';
import { GenerateInviteLink } from '@src/generated/graphql';
import { useRecoilState } from 'recoil';
import SubmitButton from '@components/UI/SubmitButton'
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';


const Workspace = () => {
  const [copied, setCopied] = useState(false);
  const [InviteLink, { data }] = useMutation(GenerateInviteLink);
  const [inviteLink, setInviteLink] = useState("")
  const [currentUserWorkspace, setCurrentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

  const HandleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const HandleInviteLink = async () => {
    try {
      const inviteLinkRes = await InviteLink({
        variables: {
          workspaceId: currentUserWorkspace?.id,
        }
      })
      await data
      setInviteLink(inviteLinkRes.data.generateWorkspaceInvitation);
    } catch (err) {
      console.error('Error during invitlink', err)
    }
  }

  return (
    <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Workspace Invites</div>
      <div className='bg-white flex md:flex-row p-4 mt-2 rounded items-center gap-4  flex-col'>
        <div className='w-full flex rounded-2xl'>
          <input className='p-4 border-none focus:outline-none focus:ring-0 focus:border-none w-full bg-gray-200 text-blue-700' type="text" name="" id="" defaultValue={inviteLink} />
          <button onClick={HandleCopy} className='p-4 bg-gray-300 hover:bg-gray-400 cursor-pointer text-stone-900 font-medium'>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
        <div>
          <SubmitButton title="Generate Invite" type='button' onClick={HandleInviteLink} Icon={FiRefreshCw} />
        </div>
      </div>
    </div>

  )
}

export default Workspace
