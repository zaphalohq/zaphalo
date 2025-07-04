import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, createContext, ReactNode, useState } from "react";
import { UpdatedInstants } from "@src/generated/graphql";
import { CreateContactMute, DeleteContact, findAllContacts } from "@src/generated/graphql";

export interface ContactsContectProps {
    isNewContacts: any,
    setIsNewContacts: Function,
    contactsData: any,
    setContactsData: Function,
    contactFormData: any,
    setContactFormData: Function,
    HandleContactsFormData: Function,
    HandleDeleteContacts: Function,
    HandleInputChange: Function,
    HandleContactsFormVisibility: Function,
    isContactFormVisible: any,
    HandleFetchData: Function,
    contactData: any,
    loading: any

}

export const ContactsContext = createContext<ContactsContectProps | undefined>(undefined)

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
    const initialContactData = {
        id: "",
        contactName: "",
        phoneNo: "",
        profileImg: "",
    }
    const [contactFormData, setContactFormData] = useState(initialContactData);
    const [contactsData, setContactsData] = useState<any>([initialContactData])
    const [isNewContacts, setIsNewContacts] = useState(false);

    const [CreateContact] = useMutation(CreateContactMute);
    const HandleContactsFormData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isNewContacts) {
            try {
                await CreateContact({
                    variables: {
                        contactName: contactFormData.contactName,
                        phoneNo: parseFloat(contactFormData.phoneNo),
                        profileImg: contactFormData.profileImg
                    }
                })
                setContactFormVisibility(false)
                HandleFetchData()

            } catch (err) {
                console.error('Error submitting form', err);
            }

        }
        else {
            try {
                await UpdateInstants({
                    variables: {
                        ...contactFormData
                    }
                })
            } catch (err) {
                console.error('Error during updating', err)
            }
        }
    }

    const [UpdateInstants] = useMutation(UpdatedInstants);
    const [isContactFormVisible, setContactFormVisibility] = useState(false);

    const HandleContactsFormVisibility = () => {
        setContactFormVisibility(!isContactFormVisible)
    }

    const HandleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactFormData({
            ...contactFormData,
            [name]: value
        })
    }

    const { data: contactData, loading, refetch } = useQuery(findAllContacts);

    const HandleFetchData = async () => {
        try {
            const contactsData1 = await contactData
            if (contactsData1 && contactsData1?.findAllContacts) {
                setContactsData(contactsData1.findAllContacts)
                await refetch()
            }

        }
        catch (err) {
            console.error('Error fetching data', err)
        }
    }

    const [deleteContact] = useMutation(DeleteContact);
    const HandleDeleteContacts = async (contactId: string) => {
        try {
            await deleteContact({
                variables: {
                    contactId: contactId
                }
            })
            HandleFetchData()
        } catch (err) {
            console.error("error from HandleDeleteInstants", err)
        }
    }

    return (
        <ContactsContext.Provider value={{
            isNewContacts,
            setIsNewContacts,
            contactsData,
            setContactsData,
            contactFormData,
            setContactFormData,
            HandleContactsFormData,
            HandleDeleteContacts,
            HandleInputChange,
            HandleContactsFormVisibility,
            isContactFormVisible,
            HandleFetchData,
            contactData,
            loading

        }}>
            {children}
        </ContactsContext.Provider>
    )
}