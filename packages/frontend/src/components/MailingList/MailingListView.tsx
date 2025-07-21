import { useMutation, useQuery } from '@apollo/client';
import { findAllMailingList, FindAllMailingContact, DeleteMailingContact } from '@src/generated/graphql';
import { useEffect, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import MailingListSaveContact from './MailingListSaveContact';

export default function MailingListView() {
  const { data, loading, error } = useQuery(findAllMailingList);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const { data : mailingContactdata, 
          loading : mailingContactLoading, 
          refetch : mailingContactRefetch,
          error : mailingContactError } = useQuery(FindAllMailingContact,{
            variables : { 
              mailingListId : selectedListId
            },
            skip : !selectedListId
          });
  const [contactsData, setContactsData] = useState([]);
  const [mailingLists, setMailingLists] = useState([])

  const handleFetchMailingContact = async () =>{
        const { data : newData } = await mailingContactRefetch()
        setContactsData(newData?.findAllMailingContactByMailingListId)
  }

  useEffect(() => {
    if (data && !loading) {
      const mailingLists = data?.findAllMailingList || [];
      setMailingLists(mailingLists)

      if (selectedListId) {
        setSelectedListId(selectedListId)
        handleFetchMailingContact()
      } else {
        setSelectedListId(mailingLists[0]?.id)
      }
    }

  }, [data, selectedListId, loading])


  //  if (loading) return <p className="p-4">Loading mailing lists...</p>;
  // if (error) return <p className="p-4 text-red-500">Error loading mailing lists</p>;

  const [isSaveContactVis, setIsSaveContactVis] = useState(false)
  const HandleSaveContactVis = () => {
    setIsSaveContactVis(!isSaveContactVis)
  }

  const [contactData, setContactData] = useState({
    contactName: '',
    contactNo: '',
    id : ''
  })

  const [deleteMailingContact] = useMutation(DeleteMailingContact)
    const HandleDeleteMailingContact = async ( mailingContactId : string) => {
      
        const response = await deleteMailingContact({
          variables : {
            mailingContactId
          }
        })

        if(response.data){
          handleFetchMailingContact()
        } 
    }



  return (
    <div className=" h-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <div className="col-span-1 bg-stone-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-stone-700">Mailing Lists</h2>
        <ul className="space-y-2 h-[75vh] overflow-y-auto">
          {mailingLists.map((list: any) => (
            <li
              key={list.id}
              className={`cursor-pointer p-2 rounded-md ${selectedListId === list.id ? 'bg-violet-200 font-medium' : 'hover:bg-stone-200'
                }`}
              onClick={() => setSelectedListId(list.id)}
            >
              {list.mailingListName || 'Unnamed List'}{` (${list.mailingContacts.length})`}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-3 ">
        <h2 className="text-xl font-semibold pl-4 mb-4 text-stone-700">Contacts</h2>

        {selectedListId ? (
          <div className="relative overflow-x-auto bg-white p-4 rounded-lg shadow-sm h-[75vh] overflow-y-scroll">
            <table className="w-full text-sm text-left text-stone-500 rounded-2xl ">
              <thead className="text-xs text-stone-700 uppercase bg-stone-200">
                <tr>
                  <th className="px-6 py-4 w-64">Contact Name</th>
                  <th className="px-6 py-4 text-center">Contact Number</th>
                  <th className="px-6 py-4 text-center">Edit</th>
                  <th className="px-6 py-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {contactsData?.map((contact: any, index: number) => (
                  <tr key={index} className="bg-white border-b border-stone-200">
                    <td className="px-6 py-4 font-medium text-stone-900 truncate">
                      {contact.contactName}
                    </td>
                    <td className="px-6 py-4 text-center truncate">{contact.contactNo}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => {
                          setContactData(contact)
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
          </div>
        ) : (
          <p className="text-stone-600">Select a mailing list to view contacts.</p>
        )}
      </div>
      {isSaveContactVis &&
        <MailingListSaveContact handleFetchMailingContact={handleFetchMailingContact}  contactData={contactData} setContactData={setContactData} HandleSaveContactVis={HandleSaveContactVis} />
      }
    </div>
  );
}
