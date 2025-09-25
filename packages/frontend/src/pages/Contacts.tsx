import { useContext, useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "@components/UI/SubmitButton"
import { ContactsContext, ContactsProvider } from "@components/Context/ContactsContext"
import ContactsList from "@src/modules/contact/components/ContactList"
import ContactForm from "@src/modules/contact/components/ContactForm"

const ContactsContent = () => {

	const [showForm, setShowForm] = useState(false);
	const [contact, setContact] = useState(false);
	const [readOnly, setReadOnly] = useState(false);
	const [isNewContacts, setIsNewContacts] = useState(true);



	return (
		<div className="min-h-screen bg-gray-50">
			{showForm ? (<ContactForm isNewContacts={isNewContacts} contactId={contact} onBack={() => setShowForm(false)} />) : (
				<>
					<div>
						<ContactsList
							showForm={setShowForm}
							setReadOnly={setReadOnly}
							setContact={setContact}
							setIsNewContacts={setIsNewContacts}
							onCreate={() => {
								setContact(false)
								setReadOnly(false)
								setIsNewContacts(true)
								setShowForm(true)
							}} />
					</div>
				</>
			)}
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
