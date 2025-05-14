import { useContext, useEffect, useState } from "react"
import InputLabel from "@UI/InputLabel"
import SubmitButton from "@UI/SubmitButton"
import CloseButton from "@UI/CloseButton"
import { ContactsContext } from "@Context/ContactsContext"

const ContactsForm = () => {
	const {

		HandleInputChange,
		contactFormData,
		setContactFormData,
		HandleFeatchData,
		HandleContactsFormData,
		HandleContactsFormVisibility,
		setIsNewContacts,
		contactData


	}: any = useContext(ContactsContext)

	const [fileError, setFileError] = useState("")
	//------------------Handle Uploaded Image-----------------------
	const HandleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(".................start");

		const file = e.target.files?.[0]
		if (file) {

			const fileSizeInMb = file.size / (1024 * 1024);

			if (fileSizeInMb > 2) {
				setFileError("Upload file size of 2mb")
				return;
			}

			//-----------Clear the setFileError if error is set-----------
			setFileError('');
			//-------------Convert image into base64--------------------

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
		<div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center">



			<div className='fixed inset-0 h-screen w-screen top-0 left-0 right-0 bottom-0 z-11 bg-stone-900/30'>
				<div className='bg-white  m-[10%] mx-[30%] p-6 pb-12 rounded-lg'>
					{/* --------------Close Button (X) when the create contact is popup--------- */}
					<CloseButton onClick={HandleContactsFormVisibility} top="top-30" right="right-100" />
					<div className='text-2xl font-semibold p-4 text-center'>Create Contact</div>
					<div className='px-6'>
						{/* -------------Create Contact form-------------------------- */}
						<form onSubmit={HandleContactsFormData}>
							<InputLabel type="text" value={contactFormData.contactName} HandleInputChange={HandleInputChange} name="contactName" title="Contact name" placeholder="Enter contact name" />
							<InputLabel type="number" value={contactFormData.phoneNo} HandleInputChange={HandleInputChange} name="phoneNo" title="Phone number" placeholder="Enter phone number" />
							<div onClick={() => {
								setContactFormData(contactData);
								setIsNewContacts(true);
							}}
								className='bg-stone-200 flex gap-2 mt-4 rounded-2xl'>
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
		</div>
	)
}

export default ContactsForm

// <CloseButton onClick={() => {
// 	setIsNewContacts(false)
// 	HandleContactsFormVisibility()
// }} right="right-60" top="top-40" />
// <form  onSubmit={async () => {
// 		await HandleContactsFormData()
// 		HandleContactsFormVisibility()
// 		HandleFeatchData()
// 		setIsNewContacts(false)
// 	}}
// className=" grid grid-cols-2 place-content-center px-8 gap-4 w-[60%] h-[45%] bg-stone-50 rounded-lg ">
// 	<InputLabel type="text" name='contactName' value={contactFormData.contactName} HandleInputChange={HandleInputChange} title="Contact Name" placeholder="eg: ConstroERP" />
// 	<InputLabel type="text" name='phoneNo' value={contactFormData.phoneNo} HandleInputChange={HandleInputChange} title="Phone No" placeholder="App ID" />
// 	{/* <InputLabel type="text" name='phoneNumberId' value={formData.phoneNumberId} HandleInputChange={HandleInputChange} title="Phone Number ID" placeholder="Phone Number ID" /> */}
// 	<SubmitButton type="submit" Icon={FaSyncAlt} title='Sync Template' />
// </form>