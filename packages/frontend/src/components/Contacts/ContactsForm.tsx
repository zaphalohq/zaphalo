import { useContext, useState } from "react"
import InputLabel from "@components/UI/InputLabel"
import SubmitButton from "@components/UI/SubmitButton"
import CloseButton from "@components/UI/CloseButton"
import { ContactsContext } from "@components/Context/ContactsContext"
import { Post } from '@src/modules/domain-manager/hooks/axios';

const ContactsForm = () => {
	const {

		HandleInputChange,
		contactFormData,
		setContactFormData,
		HandleContactsFormData,
		HandleContactsFormVisibility,
		isNewContacts
	}: any = useContext(ContactsContext)

	const [fileError, setFileError] = useState("")

	const HandleUploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const fileSizeInMb = file.size / (1024 * 1024);
			if (fileSizeInMb > 2) {
				setFileError("Upload file size of 2mb")
				return;
			}
			setFileError('');
			const formData = new FormData();

			formData.append('file', file);
			console.log(formData,'fdfddataasssssssssss');
			
			const response = await Post(
				`/fileupload`,
				formData,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			if (response && response.data) {
				setContactFormData({
					...contactFormData,
					profileImg: response.data
				})
			}

		}
	}



	return (
		<div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center">
			<div className='fixed inset-0 h-screen w-screen top-0 left-0 right-0 bottom-0 z-11 bg-stone-900/30'>
				<div className='bg-white  m-[10%] mx-[30%] p-6 pb-12 rounded-lg'>
					<CloseButton onClick={HandleContactsFormVisibility} top="top-30" right="right-100" />
					<div className='text-2xl font-semibold p-4 text-center'>Create Contact</div>
					<div className='px-6'>
						<form onSubmit={HandleContactsFormData}>
							<InputLabel type="text" value={contactFormData.contactName} HandleInputChange={HandleInputChange} name="contactName" title="Contact name" placeholder="Enter contact name" />
							<InputLabel type="number" value={contactFormData.phoneNo} HandleInputChange={HandleInputChange} name="phoneNo" title="Phone number" placeholder="Enter phone number" />
							<div
								className='bg-stone-200 flex gap-2 mt-4 rounded-2xl'>
								<label className="cursor-pointer bg-violet-500 hover:bg-violet-600 p-2  rounded-l-2xl text-stone-50" htmlFor="file_input">Upload Image</label>
								<input accept="image/*" onChange={HandleUploadImg} className="cursor-pointer p-2 text-stone-950 " type="file" name="file_input" id="file_input" />
							</div>
							{fileError && <p className="text-red-500">{fileError}</p>}
							<div className='mt-4 h-full'>
								{isNewContacts ?
									<SubmitButton title='Create contact' type='submit' />
									:
									<SubmitButton title='Update contact' type='submit' />
								}
							</div>
						</form>
					</div>

				</div>
			</div>
		</div>
	)
}

export default ContactsForm
