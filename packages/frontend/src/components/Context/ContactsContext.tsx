import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, createContext, ReactNode, useState } from "react";
import { DeleteInstantsMutation, findAllInstants, UpdatedInstants, WhatsappInstantsCreation } from "@pages/Mutation/WhatsappInstants";
import { CreateContactMute, DeleteContact, findAllContacts } from "@pages/Mutation/Chats";

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


    //------------------------Handle Created Instants-------------------
    const [CreateContact] = useMutation(CreateContactMute);
    //-----------------------Submitting the data to backend----------------------------
    const HandleContactsFormData = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log({
                    variables: {
                        contactName: contactFormData.contactName,
                        phoneNo: parseFloat(contactFormData.phoneNo),
                        profileImg: contactFormData.profileImg
                    }
                },`{
                    variables: {
                        contactName: contactFormData.contactName,
                        phoneNo: parseFloat(contactFormData.phoneNo),
                        profileImg: contactFormData.profileImg
                    }
                }`);
        
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
            //--------------------------Updating the data----------------------------------------
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

    //------------------------Handle Updated Instants-------------------
    const [UpdateInstants] = useMutation(UpdatedInstants);




    //-----------------------Handle form Visibility----------------------
    const [isContactFormVisible, setContactFormVisibility] = useState(false);
    const HandleContactsFormVisibility = () => {
        console.log("..............");

        setContactFormVisibility(!isContactFormVisible)
    }

    //---------------------------Handle Input Data from form-------------------------
    const HandleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(contactFormData,'/................');
        
        setContactFormData({
            ...contactFormData,
            [name]: value
        })
    }


    //-------------------------------Handle Featch and refeatch----------------
    const { data: contactData, loading, refetch } = useQuery(findAllContacts);

    const HandleFetchData = async () => {

        try {
            const contactsData1 = await contactData
            // refetch()
            if (contactsData1 && contactsData1?.findAllContacts) {
                setContactsData(contactsData1.findAllContacts)
                console.log(contactsData1.findAllContacts);
                await refetch()
            }

        }
        catch (err) {
            console.error('Error fetching data', err)
        }
    }

    //-----------------------------Handle Deleted Contacts------------------------
    const [deleteContact] = useMutation(DeleteContact);
    const HandleDeleteContacts = async (contactId: string) => {
        console.log(contactId,"............................................");
        
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