// // import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
// // import React, { useState } from 'react'
// // import { useRecoilState } from 'recoil';
// // import SubmitButton, { CloseButton } from './SubmitButton';
// // import InputLabel from './InputLabel';

// // const WorkspaceSetup = () => {
// //     const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

// //     const [workspaceName, setWorkspaceName] = useState('');
// //     const HandleUpdateWokspace = () => {

// //     }
// //     const [fileError, setFileError] = useState("")


// //     const HandleUploadImg = (event: any) => {
// //         const file = event.target.files[0]
// //         if (file) {
// //             const fileSizeInMb = file.size / (1024 * 1024);

// //             if (fileSizeInMb > 5) {
// //                 setFileError("Upload file size of 5mb")
// //                 return;
// //             }
// //             setFileError('');

// //         }
// //     }

// //         return (
// //             <>
// //                 {!currentUserWorkspace?.isWorkspaceSetup &&
// //                     <div className='inset-0 z-100 bg-gray-500/20 absolute'>
// //                                 <div className='bg-black  m-[10%] mx-[30%] p-6 pb-12 rounded-lg'>
// //                                     <div className='text-2xl text-gray-200  font-semibold p-4 text-center'>Setup Workspace</div>
// //                                     <div className='px-6'>
// //                                         {/* -------------Create Contact form-------------------------- */}
// //                                         <form onSubmit={HandleUpdateWokspace}>
// //                                             <InputLabel type="text" value={workspaceName} HandleInputChange={(e: any) => setWorkspaceName(e.target.value)} name="workspaceName" title="Workspace Name" placeholder="Enter workspace name" />
// //                                             <label className="cursor-pointer bg-violet-500 hover:bg-violet-600 p-2  rounded-l-2xl text-stone-50" htmlFor="file_input">Upload Profile Image</label>
// //                                             <input required accept="image/*" onChange={HandleUploadImg} className="cursor-pointer p-2 text-stone-950 " type="file" name="file_input" id="file_input" />
// //                                             {fileError && <p className="text-red-500">{fileError}</p>}
// //                                             <div className='mt-4 h-full'>
// //                                                 <SubmitButton title='Update Workspace' type='submit' />
// //                                             </div>
// //                                         </form>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 }
// //             </>
// //         )

// // }

// //     export default WorkspaceSetup

// import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
// import React, { useState } from 'react'
// import { useRecoilState } from 'recoil';
// import SubmitButton, { CloseButton } from './SubmitButton';
// import InputLabel from './InputLabel';
// import { Upload, Settings, Briefcase } from 'lucide-react';

// const WorkspaceSetup = () => {
//     const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

//     const [workspaceName, setWorkspaceName] = useState('');
//     const HandleUpdateWokspace = () => {

//     }
//     const [fileError, setFileError] = useState("")

//     const HandleUploadImg = (event: any) => {
//         const file = event.target.files[0]
//         if (file) {
//             const fileSizeInMb = file.size / (1024 * 1024);

//             if (fileSizeInMb > 5) {
//                 setFileError("Upload file size of 5mb")
//                 return;
//             }
//             setFileError('');
//         }
//     }

//     return (
//         <>
//             {!currentUserWorkspace?.isWorkspaceSetup &&
//                 <div className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4'>
//                     <div className='bg-gray-900 border border-gray-700 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden'>
//                         {/* Header */}
//                         <div className='bg-gradient-to-r from-violet-600/60 to-purple-600/60 p-6 text-center'>
//                             <div className='flex items-center justify-center gap-3 mb-2'>
//                                 <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
//                                     <Settings className='w-5 h-5 text-white' />
//                                 </div>
//                                 <h2 className='text-2xl font-bold text-white'>Setup Workspace</h2>
//                             </div>
//                             {currentUserWorkspace?.name && (
//                                 <div className='flex items-center justify-center gap-2 text-white/90'>
//                                     <Briefcase className='w-4 h-4' />
//                                     <span className='text-sm font-medium'>Workspace Name: {currentUserWorkspace.name}</span>
//                                 </div>
//                             )}
//                         </div>

//                         <div className='p-6'>
//                             <form onSubmit={HandleUpdateWokspace} className='space-y-6'>
//                                 <InputLabel 
//                                     type="text" 
//                                     value={workspaceName} 
//                                     HandleInputChange={(e: any) => setWorkspaceName(e.target.value)} 
//                                     name="workspaceName" 
//                                     title="Workspace Name" 
//                                     placeholder="Enter workspace name" 
//                                 />

//                                 <div className='space-y-3'>
//                                     <label className='block text-sm font-medium text-gray-300 mb-2'>
//                                         Profile Image
//                                     </label>
//                                     <div className='relative'>
//                                         <label 
//                                             className="flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed border-gray-600 rounded-xl hover:border-violet-500 hover:bg-violet-500/5 transition-all duration-200 cursor-pointer group" 
//                                             htmlFor="file_input"
//                                         >
//                                             <div className='w-8 h-8 bg-violet-500 group-hover:bg-violet-600 rounded-lg flex items-center justify-center transition-colors'>
//                                                 <Upload className='w-4 h-4 text-white' />
//                                             </div>
//                                             <div className='text-center'>
//                                                 <div className='text-gray-300 group-hover:text-violet-400 font-medium transition-colors'>
//                                                     Upload Profile Image
//                                                 </div>
//                                                 <div className='text-xs text-gray-500 mt-1'>
//                                                     Max file size: 5MB
//                                                 </div>
//                                             </div>
//                                         </label>
//                                         <input 
//                                             required 
//                                             accept="image/*" 
//                                             onChange={HandleUploadImg} 
//                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
//                                             type="file" 
//                                             name="file_input" 
//                                             id="file_input" 
//                                         />
//                                     </div>
//                                     {fileError && (
//                                         <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
//                                             <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                                             <p className="text-red-400 text-sm">{fileError}</p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Submit Button */}
//                                 <div className='pt-4'>
//                                     <SubmitButton title='Update Workspace' type='submit' />
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </>
//     )
// }

// export default WorkspaceSetup


import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import React, { useState } from 'react'
import { useRecoilState } from 'recoil';
import SubmitButton, { CloseButton } from './SubmitButton';
import { Upload, Settings, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { UpdateWorkspaceDetails } from '@src/pages/Mutation/workspace';

const WorkspaceSetup = () => {
    const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

    const [workspaceName, setWorkspaceName] = useState('');
    const [WorkspaceDetails] = useMutation(UpdateWorkspaceDetails);

    const [fileError, setFileError] = useState("")
    const [file, setFile] = useState<File | null>(null);
    const HandleUploadImg = async (event: any) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeInMb = file.size / (1024 * 1024);
            if (fileSizeInMb > 5) {
                setFileError("Upload file size of 5mb")
                return;
            }
            setFileError('');
            setFile(file)
        }
    }

    const HandleUpdateWokspace = async (event : any) => {
        event.preventDefault()
        const formData = new FormData();
        if (file && currentUserWorkspace?.id) {
            formData.append('file', file);
        } else {
            setFileError('file is invalid')
            return
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/fileupload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log(response.data);

            if (response.data && currentUserWorkspace?.id) {
                const workspace =  WorkspaceDetails({
                    variables: {
                        workspaceId: currentUserWorkspace?.id,
                        workspaceName,
                        profileImg: response.data
                    }
                })
                console.log(workspace,'...........................workspace.........');
                window.location.reload();
            }

        } catch (error) {
            console.error(`Error uploading file `, error);
        }
    }

    return (
        <>
                <div className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4`}>
                    <div className='bg-gray-900 border border-gray-700 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden'>
                        <div className='relative bg-gradient-to-br from-violet-600/80 via-purple-600/80 to-indigo-600/80 p-8 text-center'>
                            <div className='absolute inset-0 bg-black/10'></div>
                            <div className='relative'>
                                <div className='flex items-center justify-center gap-2'>
                                    <div className=''>
                                        <Settings className='w-8 h-8 text-white' />
                                    </div>
                                    <h2 className='text-3xl font-bold text-white mb-2'>Setup Workspace</h2>
                                </div>
                                {currentUserWorkspace?.name && (
                                    <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                                        <Briefcase className='w-4 h-4 text-white/80' />
                                        <span className='text-sm font-medium text-white/90 truncate max-w-48'>
                                            {currentUserWorkspace.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='p-8'>
                            <form onSubmit={HandleUpdateWokspace} className='space-y-8'>
                                <div className='space-y-3'>
                                    <label className='block text-sm font-semibold text-gray-200 mb-3'>
                                        Workspace Name
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            value={workspaceName}
                                            onChange={(e) => setWorkspaceName(e.target.value)}
                                            name="workspaceName"
                                            placeholder="Enter workspace name"
                                            className='w-full px-4 py-4 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-gray-500'
                                        />
                                        <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-purple-500/0 to-indigo-500/0 opacity-0 hover:opacity-10 transition-opacity duration-200 pointer-events-none'></div>
                                    </div>
                                </div>
                                <div className='space-y-3'>
                                    <label className='block text-sm font-semibold text-gray-200 mb-3'>
                                        Profile Image
                                    </label>
                                    <div className='relative'>
                                        <label
                                            className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-600 rounded-xl hover:border-violet-500 hover:bg-violet-500/5 transition-all duration-300 cursor-pointer"
                                            htmlFor="file_input"
                                        >
                                            <div className='w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 group-hover:from-violet-400 group-hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-200 mb-4'>
                                                <Upload className='w-6 h-6 text-white' />
                                            </div>
                                            <div className='text-center'>
                                                {file && <div className='text-gray-200 group-hover:text-violet-300 font-semibold text-lg transition-colors mb-1'>
                                                    Selected Image : {file?.name}
                                                </div>}
                                                {!file && <div className='text-gray-200 group-hover:text-violet-300 font-semibold text-lg transition-colors mb-1'>
                                                    Upload Profile Image
                                                </div>}
                                                <div className='text-sm text-gray-400 group-hover:text-gray-300 transition-colors'>
                                                    click to browse
                                                </div>
                                                <div className='text-xs text-gray-500 mt-2 bg-gray-800 px-3 py-1 rounded-full inline-block'>
                                                    Max: 5MB • JPG, PNG, GIF
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            // required
                                            accept="image/*"
                                            onChange={HandleUploadImg}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            type="file"
                                            name="file_input"
                                            id="file_input"
                                        />
                                    </div>
                                    {fileError && (
                                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <p className="text-red-400 text-sm font-medium">{fileError}</p>
                                        </div>
                                    )}
                                </div>
                                <div className='pt-2'>
                                    <SubmitButton title='Update Workspace' type='submit' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default WorkspaceSetup