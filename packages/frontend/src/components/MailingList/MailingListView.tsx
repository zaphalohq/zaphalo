import { useMutation, useQuery } from '@apollo/client';
import { findAllMailingList, FindAllMailingContact, DeleteMailingContact, SelectedMailingContact } from '@src/generated/graphql';
import { useEffect, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import MailingListSaveContact from './MailingListSaveContact';
import MailingContactView from './MailingContactView';

export default function MailingListView({ isMailingContactVis, setIsMailingContactVis }: any) {
  const { data, loading, error } = useQuery(findAllMailingList);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);



  const { data: mailingContactdata,
    loading: mailingContactLoading,
    refetch: mailingContactRefetch,
    error: mailingContactError } = useQuery(FindAllMailingContact, {
      variables: {
        mailingListId: selectedListId
      },
      skip: !selectedListId
    });
  const [contactsData, setContactsData] = useState([]);
  const [mailingLists, setMailingLists] = useState([])

  const handleFetchMailingContact = async () => {
    const { data: newData } = await mailingContactRefetch()
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


  const [deleteMailingContact] = useMutation(DeleteMailingContact)
  const HandleDeleteMailingContact = async (mailingContactId: string) => {

    const response = await deleteMailingContact({
      variables: {
        mailingContactId
      }
    })

    if (response.data) {
      handleFetchMailingContact()
    }
  }







  return (
    <div className='flex flex-col items-center'>
      {
        !isMailingContactVis ?
          <div className="relative overflow-x-auto md:pt-4 md:p-4 rounded-lg">
            <table className="w-6xl text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
              <thead className="text-xs text-stone-700 uppercase bg-stone-200 truncate">
                <tr>
                  <th scope="col" className="px-6 py-4 w-64 text-left truncate">Mailing List Name</th>
                  <th scope="col" className="px-6 py-4 text-center truncate">Total Contacts</th>
                  <th scope="col" className="px-6 py-4 text-center truncate">View Broadcast</th>
                  <th scope="col" className="px-6 py-4 text-center truncate">View Contacts</th>
                  {/* <th scope="col" className="px-6 py-4 text-center truncate">Updated Date</th> */}
                  <th scope="col" className="px-6 py-4 text-center truncate">Delete</th>
                </tr>
              </thead>
              <tbody>
                {mailingLists?.map((mailingList: any, index: number) => (
                  <tr key={index} className="bg-white border-b border-stone-200">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
                      title={mailingList.mailingListName}
                    >
                      {mailingList.mailingListName}
                    </th>
                    <td
                      className="px-6 py-4 text-center truncate max-w-[150px]"
                      title={String(mailingList.phoneNo)}
                    >
                      {mailingList.mailingContacts.length}
                    </td>
                    <td onClick={() => {

                    }}
                      className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="preview"
                    >
                      View
                    </td>
                    <td onClick={() => {
                      setSelectedListId(mailingList.id)
                      setIsMailingContactVis(true)
                    }}
                      className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="preview"
                    >
                      View
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={async () => {
                        }}
                        className='text-lg text-center text-[#ED4337] cursor-pointer hover:bg-stone-200 p-2 rounded'
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :
          <MailingContactView 
          selectedListId={selectedListId}
          contactsData={contactsData}
            HandleDeleteMailingContact={HandleDeleteMailingContact}
            handleFetchMailingContact={handleFetchMailingContact}
          />}

    </div>

  );
}

//  <div className=" h-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
//       <div className="col-span-1 bg-stone-100 p-4 rounded-lg">
//         <h2 className="text-lg font-semibold mb-3 text-stone-700">Mailing Lists</h2>


//         {/* <ul className="space-y-2 h-[75vh] overflow-y-auto">
//           {mailingLists.map((list: any) => (
//             <li
//               key={list.id}
//               className={`cursor-pointer p-2 rounded-md ${selectedListId === list.id ? 'bg-violet-200 font-medium' : 'hover:bg-stone-200'
//                 }`}
//               onClick={() => setSelectedListId(list.id)}
//             >
//               {list.mailingListName || 'Unnamed List'}{` (${list.mailingContacts.length})`}
//             </li>
//           ))}
//         </ul> */}
//       </div>

//       {/* <div className="col-span-3 ">
//         <h2 className="text-xl font-semibold pl-4 mb-4 text-stone-700">Contacts</h2>

//           <p className="text-stone-600">Select a mailing list to view contacts.</p>
//       </div> */}
//       {isSaveContactVis &&
//         <MailingListSaveContact handleFetchMailingContact={handleFetchMailingContact}  contactData={contactData} setContactData={setContactData} HandleSaveContactVis={HandleSaveContactVis} />
//       }
//     </div>