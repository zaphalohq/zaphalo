import { useContext, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../components/UI/SubmitButton"
import InstantsForm from "../components/WhatsappInstants/InstantsForm"
import TableListView from "../components/WhatsappInstants/TableListView"
import { ContactsContext, ContactsProvider } from "../components/Context/ContactsContext"
import ContactsForm from "../components/Contacts/ContactsForm"
import ContactsTable from "../components/Contacts/ContactsTable"

const ContactsContent = () => {
	const { 
		 setContactFormData,
		 setIsNewContacts,
		 HandleContactsFormVisibility,
		 isContactFormVisible,
		 contactData,
		 HandleFetchData
		} : any = useContext(ContactsContext)


	// // handle the fetch for the first time when page load 
	useEffect(() => {
		HandleFetchData()
	}, [contactData])

   
	return (
		<div className="h-screen">
			<div className="grid grid-cols-5 pt-4 px-4">
				<div className="md:col-start-5 md:pb-0 col-start-1 col-end-5 pb-4">
					<SubmitButton onClick={() => {
						setContactFormData({
							id: "",
							contactName: "",
							phoneNo: "",
							profileImg: "",
						})
						setIsNewContacts(true)
						HandleContactsFormVisibility()
					} 
					}   title="Create New Contact" Icon={FaPlus} />
				</div>

			</div>

			<div>
				{/* list view your are seeing on the page */}
				<ContactsTable  />
			</div> 
			{/* input and update form */}
			{isContactFormVisible ? <ContactsForm /> : null}
		</div>
	)
}

const WhatsappInstants = () => {
	return (
	  <ContactsProvider>
		<ContactsContent />
	  </ContactsProvider>
	);
  };

export default WhatsappInstants
