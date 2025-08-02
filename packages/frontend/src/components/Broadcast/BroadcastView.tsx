import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { findAllBroadcasts, SearchedBroadcast } from '@src/generated/graphql';
import TemplatePreview from '@src/components/Template/TemplatePreview';
import { MdDelete } from 'react-icons/md';
import usePagination from '@src/utils/usePagination';
import Pagination from '../UI/Pagination';
import { SearchWhite } from '../UI/Search';
import BroadcastTemplatePreview from './BroadcastTemplatePreview';

function BroadcastView({isTemplateVis,
                    setIsTemplateVis,
                    isMailingListVis,
                    setIsMailingListVis} : any) {
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    setTotalPages
  } = usePagination()

  const { data, refetch, loading } = useQuery(findAllBroadcasts, {
    variables: {
      currentPage,
      itemsPerPage
    }
  });
  
  const [allbroadcasts, setAllBroadcasts] = useState<any[]>([]);
  const [dbTemplateId, setDbTemplateId] = useState('');
  const [mailingListId, setMailingListId] = useState('');

  useEffect(() => {
    const fetchAndSetBroadcasts = async () => {
      if (!loading && data) {
        const { data: newData } = await refetch();
        if (newData?.findAllBroadcast?.allBroadcast.length > 0) {
          setAllBroadcasts(newData.findAllBroadcast?.allBroadcast);
          setTotalPages(newData.findAllBroadcast.totalPages)

        }
      }
    };

    fetchAndSetBroadcasts();
  }, [loading, data]);

  const [searchTerm, setSearchTerm] = useState('')
  const {
    data: searchedBroadcastData,
    loading: searchedBroadcastLoading,
    refetch: searchedBroadcastRefetch } = useQuery(SearchedBroadcast, {
      variables: {
        searchTerm
      },
      skip: !searchTerm
    });

  useEffect(() => {
    if (searchTerm) {
      searchedBroadcastRefetch().then(({ data }) => {
        setAllBroadcasts(data.searchBroadcast?.searchedData)
        setTotalPages(0)
      });
    }
  }, [searchTerm])

  return (
    <div>
      {!isTemplateVis && !isMailingListVis && 
      <div>
      <div className="grid grid-cols-4 my-4">
        <div className='col-start-4'>
          <SearchWhite HandleSearch={(e: any) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="relative h-[65vh] overflow-y-scroll  md:px-4 rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
          <thead className="sticky top-0 text-xs text-stone-700 uppercase bg-stone-200 truncate">
            <tr>
              <th scope="col" className="px-6 py-4 w-64 text-left truncate">Broadcast Name</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Total Broadast</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Sent Broadast</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Broadcast Complated</th>
              <th scope="col" className="px-6 py-4 text-center truncate">View Template</th>
              <th scope="col" className="px-6 py-4 text-center truncate">View Mailing List</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Delete</th>
            </tr>
          </thead>
          <tbody>
            {allbroadcasts?.map((broadcast: any, index: number) => (
              <tr key={index} className="bg-white border-b border-stone-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
                  title={broadcast.broadcastName}
                >
                  {broadcast.broadcastName}
                </th>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={broadcast.totalBroadcast}
                >
                  {broadcast.totalBroadcast}
                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={broadcast.totalBroadcastSend}
                >
                  {broadcast.totalBroadcastSend}
                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={String(broadcast.isBroadcastDone)}
                >
                  {broadcast.isBroadcastDone ? `✅` : `❌`}
                </td>
                <td onClick={() => {
                  setDbTemplateId(broadcast.template.id)
                  setIsTemplateVis(true)
                }}
                  className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                  title="preview"
                >
                  View
                </td>
                <td onClick={() => {

                  setMailingListId(broadcast.mailingList.id)
                  setIsMailingListVis(true)
                }
                }
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
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      </div>
      }
      {isTemplateVis &&
        <BroadcastTemplatePreview dbTemplateId={dbTemplateId} />
      }
      {isMailingListVis && <></>
        // <BroadcastTemplatePreview mailingListId={mailingListId} />
      }
    </div>
  );
}

export default BroadcastView;

// <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
//     <div className="col-span-1 bg-stone-100 p-4 mb-4 rounded-lg">
//         <h2 className="text-lg font-semibold mb-3 text-stone-700">Broadcasts</h2>
//         <ul className="space-y-2 h-[65vh] overflow-y-auto">
//             {broadcasts.map(broadcast => (
//                 <li
//                     key={broadcast.id}
//                     className={`cursor-pointer p-3 rounded-md border ${selectedBroadcastId === broadcast.id
//                         ? 'bg-violet-100 border-violet-400 shadow'
//                         : 'hover:bg-stone-200 border-stone-300'
//                         }`}
//                     onClick={() => {
//                         setSelectedBroadcastId(broadcast.id);
//                         setViewType('template');
//                     }}
//                 >
//                     <p className="text-gray-600 font-semibold text-md truncate">
//                         Broadcast Name : <span className='text-gray-800 text-lg'>{broadcast.broadcastName || 'Unnamed Broadcast'}</span>
//                     </p>
//                     <p className="text-sm text-stone-600 mt-1 font-semibold">
//                         Total broacast: <span className="font-medium text-stone-700">{broadcast.totalBroadcast}</span>
//                     </p>
//                     <p className="text-sm  text-stone-600 mt-1 font-semibold">
//                         Total Sent: <span className="font-medium text-stone-700">{broadcast.totalBroadcastSend || 0}</span>
//                     </p>
//                     <p className="text-xs text-stone-500 mt-1">
//                         {new Date(broadcast.createdAt).toLocaleString()}
//                     </p>
//                 </li>
//             ))}
//         </ul>
//     </div>

//     <div className="col-span-3">
//         {selectedBroadcast ? (
//             <div className="relative bg-white p-4 rounded-lg shadow-sm h-[75vh] ">
//                 {/* <table className="w-full text-sm text-center text-stone-600">
//                     <thead className="text-xs text-stone-700 uppercase bg-stone-200">
//                         <tr>
//                             <th className="px-6 py-4">Broadcast Name</th>
//                             <th className="px-6 py-4">Total Broadcast</th>
//                             <th className="px-6 py-4">Total Send</th>
//                             <th className="px-6 py-4">Completed</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                             <tr className="bg-white border-b border-stone-100">
//                                 <td className="px-6 py-4">{selectedBroadcast.broadcastName}</td>
//                                 <td className="px-6 py-4">{selectedBroadcast.totalBroadcast}</td>
//                                 <td className="px-6 py-4">{selectedBroadcast.totalBroadcastSend}</td>
//                                 <td className="px-6 py-4">{selectedBroadcast.isBroadcastDone ? '✅' : '❌'}</td>
//                             </tr>
//                     </tbody>
//                 </table> */}

//                 <div className="grid grid-cols-3  justify-between items-center my-4">
//                     <div className="col-start-3">
//                         <button
//                             onClick={() => setViewType('template')}
//                             className={`px-4 py-1 mx-4 rounded-md cursor-pointer ${viewType === 'template'
//                                 ? 'bg-violet-600 text-white'
//                                 : 'bg-stone-200 text-stone-700'}`}
//                         >
//                             Template
//                         </button>
//                         <button
//                             onClick={() => setViewType('mailingList')}
//                             className={`px-4 py-1 rounded-md cursor-pointer ${viewType === 'mailingList'
//                                 ? 'bg-violet-600 text-white'
//                                 : 'bg-stone-200 text-stone-700'}`}
//                         >
//                             Mailing List
//                         </button>
//                     </div>
//                 </div>

//                 {viewType === 'template' && (
//                     <>
//                         <div className='border-b pb-4 border-gray-300'>
//                             Template Name :
//                             <span className='font-semibold'>
//                                 {" " + selectedBroadcast.template.templateName}
//                             </span>
//                         </div>
//                         <TemplatePreview templatePreviewData={selectedBroadcast.template} />
//                     </>
//                 )}

//                 {viewType === 'mailingList' && (
//                     <>
//                         <div className='border-b pb-4 border-gray-300'>
//                             Mailing List Name :
//                             <span className='font-semibold'>
//                                 {" " + selectedBroadcast.mailingList?.mailingListName}
//                             </span>
//                         </div>
//                         <div className="mt-4 rounded-lg border h-[55vh] border-stone-200 overflow-y-auto">
//                             <table className="w-full text-sm text-left text-stone-600">
//                                 <thead className="text-xs text-stone-700 uppercase bg-stone-200">
//                                     <tr>
//                                         <th className="px-6 py-4">Contact Name</th>
//                                         <th className="px-6 py-4">Contact Number</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {selectedBroadcast.mailingList?.mailingContacts?.map((contact: any, index: number) => (
//                                         <tr key={index} className="bg-white border-b border-stone-100">
//                                             <td className="px-6 py-4">{contact.contactName}</td>
//                                             <td className="px-6 py-4">{contact.contactNo}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </>
//                 )}
//             </div>
//         ) : (
//             <p className="text-stone-600">Select a broadcast to view details.</p>
//         )}
//     </div>
// </div>
