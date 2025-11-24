import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@src/components/UI/dialog'
import { Button } from '@src/components/UI/button'
import { FiEdit2 } from 'react-icons/fi';
import { Input } from './input';
import { Label } from './label';
import { first } from 'rxjs';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { FileFolder, UpdateUser, useUploadFileMutation } from '@src/generated/graphql';
import { useRecoilState } from 'recoil';
import { currentUserState } from '@src/modules/auth/states/currentUserState';
import { useApolloCoreClient } from '@src/modules/apollo/hooks/useApolloCoreClient';
import { isDefined } from '@src/utils/validation/isDefined';
import { VITE_BACKEND_URL } from '@src/config';

const UserUpdateDialog = ({ isProfileEdit, setIsProfileEdit }) => {

    const [currentUser] = useRecoilState(currentUserState);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const coreClient = useApolloCoreClient();
    const [uploadFile] = useUploadFileMutation({ client: coreClient });

    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [uploadedImgPath, setUploadedImgPath] = useState<string | null>(null);

    const [userFormData, setUserFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    const getInitials = (firstName: string, lastName: string) => {
        if (!firstName || !lastName) return 'Y';
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    };




    const [updateUser, { loading }] = useMutation(UpdateUser, {
        onCompleted: () => {
            toast.success("User Updated Successfully")
            setIsProfileEdit(false);
        },
        onError: (err) => {
            toast.error("Error In User Updated")
            console.error("Error updating user:", err);
        }
    });

    useEffect(() => {
        if (!currentUser?.email) {
            toast.error('No email found for this user. Please contact support.');
            setIsProfileEdit(false)
            return;
        }
        if (currentUser) {
            setUserFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || ''
            });
        }
    }, [currentUser, isProfileEdit]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileSizeInMb = file.size / (1024 * 1024);
            if (fileSizeInMb > 2) {
                toast.error("Upload file size of 2mb")
                return;
            }

            const result = await uploadFile({
                variables: {
                    file,
                    fileFolder: FileFolder.ProfilePicture,
                },
            });

            const signedFile = result?.data?.uploadFile;
            console.log(signedFile)
            if (!isDefined(signedFile)) {
                toast.error('failed to upload Workspace-logo')
            }
            else {
                setPreviewImg(URL.createObjectURL(file));
                setUploadedImgPath(signedFile.path);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userFormData.firstName || !userFormData.firstName) {
            toast.error("Please filled required fields")
            return;
        }

        try {
            await updateUser({
                variables: {
                    userData: {
                        firstName: userFormData.firstName,
                        lastName: userFormData.lastName,
                        email: userFormData.email,
                        profileImg: uploadedImgPath || currentUser?.profileImg || ''
                    }
                }
            });
        } catch (error) {
            console.error("Update failed:", error);
        }

    }

    return (
        <>
            <Dialog open={isProfileEdit} onOpenChange={setIsProfileEdit}>
                <DialogContent className="overflow-auto">
                    <DialogHeader className="text-center py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <DialogTitle className="text-lg font-semibold text-gray-800">Update Profile</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center space-y-6 py-6">
                            <div className='flex flex-col space-y-3'>
                                <div className="w-24 h-24 flex justify-center bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full shadow-lg">
                                    {previewImg ? (
                                        <img src={previewImg} className="w-full h-full object-cover rounded-full" />
                                    ) : currentUser?.profileImg ? (
                                        <img src={`${VITE_BACKEND_URL}/files/${currentUser.profileImg}`} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-white">
                                            {getInitials(currentUser?.firstName, currentUser?.lastName)}
                                        </div>
                                    )}
                                </div>
                                <div className='flex justify-center items-center'>
                                    <span onClick={() => fileInputRef.current?.click()} className="text-sm text-green-600 cursor-pointer hover:underline">Edit</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        className="hidden"
                                        onChange={(e) => {
                                            handleFileUpload(e)
                                        }}
                                    />
                                </div>

                            </div>

                            <div className="w-full max-w-md grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <Label>
                                        First Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="First name"
                                        required={true}
                                        value={userFormData.firstName}
                                        onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Last Name
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Last name"
                                        required={true}
                                        value={userFormData.lastName}
                                        onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="w-full max-w-md space-y-2">
                                <Label>
                                    Email Address
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    readOnly={true}
                                    value={userFormData.email}
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => setIsProfileEdit(false)}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                Update Profile
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserUpdateDialog