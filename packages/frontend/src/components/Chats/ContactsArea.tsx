import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { FiPlus, FiUsers } from 'react-icons/fi'
import ListContacts from './ListContacts'
import { SearchWhite } from '@components/UI/Search'
import { findAllContacts } from '@src/generated/graphql'


const ContactList = ({ HandleNewChatVisiablity, HandleCreateContactVis }: any) => {
    const { data, loading, refetch } = useQuery(findAllContacts)
    const [allContacts, setAllContacts] = useState([{
        contactName: "",
        phoneNo: null,
        profileImg: "",
    }])
    const HandleFetchContacts = async () => {
        const contactsData = await data
        if (data && data?.findAllContacts) {
            setAllContacts(contactsData.findAllContacts)
            await refetch()
        }
    }
    useEffect(() => {
        HandleFetchContacts()
    }, [data])

    const [searchedContactsChar, setSearchContactsChar] = useState("")
    const [filteredContacts, setFilteredContacts] = useState(allContacts);
    
    useEffect(() => {

        if (!searchedContactsChar) {
            setFilteredContacts(allContacts);
            return;
        }
        const searchedContacts = allContacts.filter((contacts: any) =>
            contacts.contactName
                .toLowerCase()
                .startsWith(searchedContactsChar.toLowerCase() || "")
        );
        setFilteredContacts(searchedContacts);
    }, [searchedContactsChar, allContacts])

    return (
        <div className="absolute rounded top-10 md:left-4 z-20 right-[0] bg-white shadow-2xl py-4 w-[40vh]">
            <div className="text-lg font-semibold px-4 ">New chat</div>
            <div className="px-4 py-3 ">
                <SearchWhite HandleSearch={(event: any) => setSearchContactsChar(event.target.value)} />
            </div>
            <div className="overflow-y-scroll h-[50vh]">
                <div onClick={() => {
                    HandleNewChatVisiablity()
                    HandleCreateContactVis()
                }
                }
                    className="bg-gray-100 cursor-pointer hover-light w-full  flex gap-3 px-4 items-center p-2 border-b border-gray-200">
                    <span className="text-lg rounded-full bg-stone-200 p-3 text-stone-950">
                        <FiPlus />
                    </span>
                    <span className="font-semibold">New contacts</span>
                </div>
                <div className="px-4 p-2 bg-gray-100 font-medium sticky top-0 ">All contacts</div>
                {filteredContacts.map((contactData, index) => <ListContacts key={index} phoneNo={contactData.phoneNo} HandleNewChatVisiablity={HandleNewChatVisiablity} profileImg={contactData.profileImg} contactName={contactData.contactName} />)}
            </div>
        </div>
    )
}

export default ContactList

