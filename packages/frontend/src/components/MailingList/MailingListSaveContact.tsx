import SaveContact from "../UI/SaveContact"
import { useMutation } from "@apollo/client"
import { SaveMailingContact } from "@src/generated/graphql"

const MailingListSaveContact = ({ 
        setTriggerRefetch, 
        contactData, 
        setContactData, 
        HandleSaveContactVis, 
}: any) => {
    const [saveMailingContact] = useMutation(SaveMailingContact);

    const HandleChangeData = (event: any) => {
        setContactData((prev: any) => ({
            ...prev,
            [event.target.name]: String(event.target.value)
        }))
    }

    const HandleSubmitContact = async (event: any) => {
        event.preventDefault()
        const { __typename, createdAt, ...restContactData } = contactData
        const response = await saveMailingContact({
            variables: {
                saveMailingContact: restContactData
            }
        })
        if (response.data) {
            // handleFetchMailingContact()
            setTriggerRefetch((prev: boolean) => !prev)
            HandleSaveContactVis()
        }

    }




    return (
        <div>
            <SaveContact HandleSaveContactVis={HandleSaveContactVis}
                         HandleSubmitContact={HandleSubmitContact}
                         contactData={contactData}
                         HandleChangeData={HandleChangeData}
                         />
        </div>
    )
}

export default MailingListSaveContact
