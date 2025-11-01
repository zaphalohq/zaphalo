import { Dialog,DialogContent, DialogHeader, DialogTitle } from "../UI/dialog"
import ContactForm from "@src/modules/contact/components/ContactForm"

const CreateUpdateContactDialog = ({ open, isNewContact, contactId, onBack }) => {
    return (
        <>
            <Dialog open={open} onOpenChange={onBack}>
                <DialogContent>
                        <ContactForm
                            isNewContacts={isNewContact}
                            contactId={contactId}
                            onBack={onBack} >
                        </ContactForm>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateUpdateContactDialog
