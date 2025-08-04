import { useEffect, useState } from "react"
import { FiEdit2 } from "react-icons/fi"
import { MdDelete } from "react-icons/md"
import MailingListSaveContact from "./MailingListSaveContact"
import Pagination from "../UI/Pagination"
import { useMutation, useQuery } from "@apollo/client"
import { DeleteMailingContact, GetMailingContacts, SelectedMailingContact } from "@src/generated/graphql"
import { SearchWhite } from "../UI/Search"
import usePagination from "@src/utils/usePagination"
import SubmitButton from "../UI/SubmitButton"
import { FaPlus } from "react-icons/fa"

const MailingContactView = ({
    selectedListId,
    // HandleDeleteMailingContact,
    handleFetchMailingContact }: any) => {
    const [triggerRefetch, setTriggerRefetch] = useState(false)
    const [contactData, setContactData] = useState({
        contactName: '',
        contactNo: '',
        id: '',
        mailingListId: ''
    })

    const [isSaveContactVis, setIsSaveContactVis] = useState(false)
    const HandleSaveContactVis = () => {
        setIsSaveContactVis(!isSaveContactVis)
    }

    const {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        setTotalPages
    } = usePagination()

    const [currentContacts, setCurrentContacts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const {
        data: mailingContactData,
        loading: mailingContactLoading,
        refetch: mailingContactRefetch, error } = useQuery(SelectedMailingContact, {
            variables: {
                mailingListId: selectedListId,
                currentPage,
                itemsPerPage
            },
            skip: !selectedListId
        });

    useEffect(() => {
        if (selectedListId && !searchTerm) {
            mailingContactRefetch().then(({ data }) => {
                setCurrentContacts(data.selectedMailingContact.mailingContact)
                setTotalPages(data.selectedMailingContact.totalPages)
            });
        }
    }, [mailingContactData, selectedListId, mailingContactLoading, searchTerm, triggerRefetch])

    const { refetch: searchedMailingContactRefetch } = useQuery(GetMailingContacts, {
        variables: {
            mailingListId: selectedListId,
            searchTerm
        },
        skip: !searchTerm
    });

    useEffect(() => {
        if (searchTerm) {
            searchedMailingContactRefetch().then(({ data }) => {
                setCurrentContacts(data.searchAndPaginateContact.mailingContact)
                setTotalPages(0)
            });
        }
    }, [searchTerm])


    const [deleteMailingContact] = useMutation(DeleteMailingContact)
    const HandleDeleteMailingContact = async (mailingContactId: string) => {

        const response = await deleteMailingContact({
            variables: {
                mailingContactId
            }
        })

        if (response.data) {
            setTriggerRefetch(!triggerRefetch)
        }
    }

    return (
        <div >
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <div className='col-start-1 pl-4 pt-4'>
                    <SearchWhite HandleSearch={(e: any) => setSearchTerm(e.target.value)} />
                </div>
                <div className='col-start-4 end pr-8 pb-4 md:pb-0 '>
                    <SubmitButton type='button'
                        onClick={() => {
                            setContactData({
                                contactName: '',
                                contactNo: '',
                                id: '',
                                mailingListId: selectedListId
                            })
                            HandleSaveContactVis()
                        }} title="Create" Icon={FaPlus} />
                </div>
            </div>

            <div className="relative w-6xl overflow-x-auto bg-white px-4 h-[68vh] overflow-y-auto">
                <table className="w-full text-sm text-left text-stone-500 rounded-2xl ">
                    <thead className="text-xs sticky top-0 text-stone-700 uppercase bg-stone-200">
                        <tr>
                            <th className="px-6 py-4 w-64">Contact Name</th>
                            <th className="px-6 py-4 text-center">Contact Number</th>
                            <th className="px-6 py-4 text-center">Edit</th>
                            <th className="px-6 py-4 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContacts?.map((contact: any, index: number) => (
                            <tr key={index} className="bg-white border-b border-stone-200">
                                <td className="px-6 py-4 font-medium text-stone-900 truncate">
                                    {contact.contactName}
                                </td>
                                <td className="px-6 py-4 text-center truncate">{contact.contactNo}</td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        onClick={() => {
                                            setContactData({ ...contact, mailingListId: selectedListId })
                                            HandleSaveContactVis()
                                        }}
                                        className="text-lg text-violet-500 hover:bg-stone-200 p-2 rounded cursor-pointer"
                                    >
                                        <FiEdit2 />
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        onClick={() => {
                                            HandleDeleteMailingContact(contact.id)
                                        }}
                                        className="text-lg text-[#ED4337] hover:bg-stone-200 p-2 rounded cursor-pointer"
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isSaveContactVis &&
                    <MailingListSaveContact handleFetchMailingContact={handleFetchMailingContact} contactData={contactData} setContactData={setContactData} HandleSaveContactVis={HandleSaveContactVis} />
                }

            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default MailingContactView
