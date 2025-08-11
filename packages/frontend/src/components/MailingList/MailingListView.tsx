import { useQuery } from '@apollo/client';
import { findAllMailingList, FindAllMailingContact, searchMailingList } from '@src/generated/graphql';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import MailingContactView from './MailingContactView';
import { SearchWhite } from '../UI/Search';
import usePagination from '@src/utils/usePagination';
import Pagination from '../UI/Pagination';

export default function MailingListView({ isMailingContactVis, setIsMailingContactVis }: any) {

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('')
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    setTotalPages
  } = usePagination()

  const { data: mailingListData,
    loading: mailingListLoading,
    refetch: mailingListRefetch } = useQuery(findAllMailingList, {
      variables: {
        currentPage,
        itemsPerPage
      }
    });
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


  useEffect(() => {
    if (mailingListData && !mailingListLoading && !searchTerm) {
      // const mailingLists = mailingListData?.findAllMailingList?.mailingList || [];
      mailingListRefetch().then((mailingListData: any) => {
        setMailingLists(mailingListData?.data?.findAllMailingList?.mailingList);
        setTotalPages(mailingListData?.data?.findAllMailingList?.totalPages);
      })

      // if (selectedListId) {
      //   setSelectedListId(selectedListId)
      //   handleFetchMailingContact()
      // } else {
      //   setSelectedListId(mailingLists[0]?.id)
      // }
    }

  }, [mailingListData, selectedListId, mailingListLoading, searchTerm]);


  const {
    data: searchMailingListData,
    loading: searchMailingListLoading,
    refetch: searchMailingListRefetch } = useQuery(searchMailingList, {
      variables: {
        searchTerm
      },
      skip: !searchTerm
    });

  useEffect(() => {
    if (searchTerm) {
      searchMailingListRefetch().then(({ data }) => {
        console.log(data, 'mailisnlisei');

        setMailingLists(data.searchMailingList?.searchedData)
        setTotalPages(0)
      });
    }
  }, [searchTerm])



  return (
    <div className='flex flex-col items-center'>
      {!isMailingContactVis ?
          <div>
            <div className="grid grid-cols-4 my-4">
              <div className='col-start-4'>
                <SearchWhite HandleSearch={(e: any) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="relative h-[65vh] overflow-y-auto overflow-x-auto">
              <table className="w-6xl text-sm text-left text-stone-500">
                <thead className="text-xs sticky top-0 text-stone-700 uppercase bg-stone-200 truncate">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-64 text-left truncate">Contact List Name</th>
                    <th scope="col" className="px-6 py-4 text-center truncate">Total Contacts</th>
                    <th scope="col" className="px-6 py-4 text-center truncate">View Contacts</th>
                    <th scope="col" className="px-6 py-4 text-center truncate">Created Date</th>
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
                        title={String(mailingList.totalContacts)}
                      >
                        {mailingList.totalContacts}
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
                      <td
                        className="px-6 py-4 text-center truncate max-w-[150px]"
                        title={JSON.stringify(mailingList.createdAt)}
                      >
                        {new Date(Number(mailingList.createdAt)).toLocaleString()}
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
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          :
          <MailingContactView
            selectedListId={selectedListId}
            contactsData={contactsData}
          />}

    </div>

  );
}