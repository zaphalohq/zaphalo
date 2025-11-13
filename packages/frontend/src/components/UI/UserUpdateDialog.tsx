import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@src/components/UI/dialog'
import { Button } from '@src/components/UI/button'
import { FiEdit2 } from 'react-icons/fi';
import { Input } from './input';
import { Label } from './label';
import { first } from 'rxjs';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { UpdateUser } from '@src/generated/graphql';

const UserUpdateDialog = ({ isProfileEdit, setIsProfileEdit, currentUser }) => {

    const [userFormData, setUserFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

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
                        email: userFormData.email
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