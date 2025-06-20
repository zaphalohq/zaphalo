import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import React, { useState } from 'react'
import { useRecoilState } from 'recoil';
import SubmitButton, { CloseButton } from './SubmitButton';
import InputLabel from './InputLabel';

const WorkspaceSetup = () => {
  const [ currentUserWorkspace ] = useRecoilState(currentUserWorkspaceState);

    const [workspaceName, setWorkspaceName] = useState('');
    const HandleUpdateWokspace = () => {

    }
    const [fileError, setFileError] = useState("")


    const HandleUploadImg = (event: any) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeInMb = file.size / (1024 * 1024);

            if (fileSizeInMb > 5) {
                setFileError("Upload file size of 5mb")
                return;
            }
            setFileError('');

        }
    }

        return (
            <>
                {{currentUserWorkspace?.isWorkspaceSetup} &&
                    <div className='inset-0 z-100 bg-gray-500/20 absolute'>
                                <div className='bg-black  m-[10%] mx-[30%] p-6 pb-12 rounded-lg'>
                                    <div className='text-2xl text-gray-200  font-semibold p-4 text-center'>Setup Workspace</div>
                                    <div className='px-6'>
                                        {/* -------------Create Contact form-------------------------- */}
                                        <form onSubmit={HandleUpdateWokspace}>
                                            <InputLabel type="text" value={workspaceName} HandleInputChange={(e: any) => setWorkspaceName(e.target.value)} name="contactName" title="Contact name" placeholder="Enter contact name" />
                                            <label className="cursor-pointer bg-violet-500 hover:bg-violet-600 p-2  rounded-l-2xl text-stone-50" htmlFor="file_input">Upload Image</label>
                                            <input required accept="image/*" onChange={HandleUploadImg} className="cursor-pointer p-2 text-stone-950 " type="file" name="file_input" id="file_input" />
                                            {fileError && <p className="text-red-500">{fileError}</p>}
                                            <div className='mt-4 h-full'>
                                                <SubmitButton title='Create contact' type='submit' />
                                            </div>
                                        </form>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    
}

    export default WorkspaceSetup
