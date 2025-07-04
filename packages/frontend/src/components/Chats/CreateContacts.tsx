import { useState, React } from 'react';
import { useMutation } from '@apollo/client';
import CloseButton from '@components/UI/CloseButton'
import InputLabel from '@components/UI/InputLabel'
import SubmitButton from '@components/UI/SubmitButton'
import { CreateContactMute } from '@src/generated/graphql';

const CreateContacts = ({ HandleCreateContactVis }: any) => {

    const [contactFormData, setContactFormData]: any = useState({
        contactName: "",
        phoneNo: 0.1,
        profileImg: ""
    })
    const HandleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setContactFormData({
            ...contactFormData,
            [name]: value
        })
    }

    const [CreateContact] = useMutation(CreateContactMute);
    const HandleSubmitContact = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            await CreateContact({
                variables: {
                    contactName: contactFormData.contactName,
                    phoneNo: parseFloat(contactFormData.phoneNo),
                    profileImg: contactFormData.profileImg
                }
            })
            HandleCreateContactVis()
        } catch (err) {
            console.error('Error during updating', err)
        }

    }

    const [fileError, setFileError] = useState("")
    const HandleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if (file) {

            const fileSizeInMb = file.size / (1024 * 1024);

            if (fileSizeInMb > 2) {
                setFileError("Upload file size of 2mb")
                return;
            }
            setFileError('');

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setContactFormData({
                    ...contactFormData,
                    profileImg: reader.result as string
                })
            })

            reader.readAsDataURL(file)
        }
    }

    return (
        <div className='fixed inset-0 h-screen w-screen top-0 left-0 right-0 bottom-0 z-11 bg-stone-900/30'>
            <div className='bg-white  m-[10%] mx-[30%] p-6 pb-12 rounded-lg'>
                <CloseButton onClick={HandleCreateContactVis} top="top-30" right="right-100" />
                <div className='text-2xl font-semibold p-4 text-center'>Create Contact</div>
                <div className='px-6'>
                    <form onSubmit={HandleSubmitContact}>
                        <InputLabel type="text" HandleInputChange={HandleChangeData} name="contactName" title="Contact name" placeholder="Enter contact name" />
                        <InputLabel type="number" HandleInputChange={HandleChangeData} name="phoneNo" title="Phone number" placeholder="Enter phone number" />
                        <div className='bg-stone-200 flex gap-2 mt-4 rounded-2xl'>
                            <label className="cursor-pointer bg-violet-500 hover:bg-violet-600 p-2  rounded-l-2xl text-stone-50" htmlFor="file_input">Upload Image</label>
                            <input required accept="image/*" onChange={HandleUploadImg} className="cursor-pointer p-2 text-stone-950 " type="file" name="file_input" id="file_input" />
                        </div>
                        {fileError && <p className="text-red-500">{fileError}</p>}
                        <div className='mt-4 h-full'>
                            <SubmitButton title='Create contact' type='submit' />
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default CreateContacts
