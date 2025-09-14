import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { Input } from "@src/components/UI/input";
import { Button } from "@src/components/UI/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/UI/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";
import usePagination from '@src/utils/usePagination';
import BroadcastTemplatePreview from '@src/components/Broadcast/BroadcastTemplatePreview';

const sampleData = [
  { id: 1, name: "Campaign A", status: "New", template: "Template 1" },
  { id: 2, name: "Campaign B", status: "Inprogress", template: "Template 2" },
  { id: 3, name: "Campaign C", status: "Completed", template: "Template 3" },
  { id: 4, name: "Campaign D", status: "Cancelled", template: "Template 4" },
];

import { findAllBroadcasts, SearchedBroadcast } from '@src/generated/graphql';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Plus } from "lucide-react";


export default function BroadcastList({
  onCreate,
  showForm,
  setReadOnly,
}) {
  const [records] = useState(sampleData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredRecords = records.filter((rec) => {
    const matchSearch = rec.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || rec.status === filter;
    return matchSearch && matchFilter;
  });

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/*<h1 className="text-2xl font-bold"></h1>*/}
        <PageHeader title="WhatsApp Broadcasts" className="w-full"
        actions={
          <>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Broadcast
            </Button>
          </>
        }/>

      </div>

      {/* Search + Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={(val) => setFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Inprogress">Inprogress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table List View */}
      <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
        <TableHeader className="text-black">
          <TableRow className="bg-gray-100 uppercase text-sm font-semibold">
            <TableHead className="px-4 py-3">Name</TableHead>
            <TableHead className="px-4 py-3">Template</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3">Preview Template</TableHead>
            <TableHead className="px-4 py-3">View Contact List</TableHead>
            <TableHead className="px-4 py-3">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-black">
          {allbroadcasts.length > 0 ? (
            allbroadcasts.map((broadcast) => (
              <TableRow key={broadcast.id} className="bg-white border-b border-stone-200">
                <TableCell className="px-4 py-5">{broadcast.broadcastName}</TableCell>
                <TableCell className="px-4 py-5">{broadcast.totalBroadcast}</TableCell>
                <TableCell className="px-4 py-5">{broadcast.totalBroadcastSend}</TableCell>
                <TableCell onClick={() => {
                  setDbTemplateId(broadcast.template.id)
                  setShowTemplate(true)
                  setReadOnly(true)
                }}
                  className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                  title="preview"
                >
                  <BroadcastTemplatePreview dbTemplateId={broadcast.template.id}/>
                </TableCell>
                <TableCell className="px-4 py-5" onClick={() => {

                  setMailingListId(broadcast.mailingList.id)
                  setIsMailingListVis(true)
                }
                }
                  className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                  title="preview"
                >
                  View
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}



// import { useQuery } from '@apollo/client';
// import { useState, useEffect } from 'react';
// import TemplatePreview from '@src/components/Template/TemplatePreview';
// import { MdDelete } from 'react-icons/md';
// import usePagination from '@src/utils/usePagination';
// import Pagination from '@src/components/UI/Pagination';
// import { SearchWhite } from '@src/components/UI/Search';
// import BroadcastTemplatePreview from '@src/components/Broadcast/BroadcastTemplatePreview';

// export default function BroadcastList({isTemplateVis,
//                     setIsTemplateVis,
//                     isMailingListVis,
//                     setIsMailingListVis} : any) {
//   const {
//     currentPage,
//     setCurrentPage,
//     itemsPerPage,
//     totalPages,
//     setTotalPages
//   } = usePagination()

//   const { data, refetch, loading } = useQuery(findAllBroadcasts, {
//     variables: {
//       currentPage,
//       itemsPerPage
//     }
//   });
  
//   const [allbroadcasts, setAllBroadcasts] = useState<any[]>([]);
//   const [dbTemplateId, setDbTemplateId] = useState('');
//   const [mailingListId, setMailingListId] = useState('');

//   useEffect(() => {
//     const fetchAndSetBroadcasts = async () => {
//       if (!loading && data) {
//         const { data: newData } = await refetch();
//         if (newData?.findAllBroadcast?.allBroadcast.length > 0) {
//           setAllBroadcasts(newData.findAllBroadcast?.allBroadcast);
//           setTotalPages(newData.findAllBroadcast.totalPages)

//         }
//       }
//     };

//     fetchAndSetBroadcasts();
//   }, [loading, data]);

//   const [searchTerm, setSearchTerm] = useState('')
//   const {
//     data: searchedBroadcastData,
//     loading: searchedBroadcastLoading,
//     refetch: searchedBroadcastRefetch } = useQuery(SearchedBroadcast, {
//       variables: {
//         searchTerm
//       },
//       skip: !searchTerm
//     });

//   useEffect(() => {
//     if (searchTerm) {
//       searchedBroadcastRefetch().then(({ data }) => {
//         setAllBroadcasts(data.searchBroadcast?.searchedData)
//         setTotalPages(0)
//       });
//     }
//   }, [searchTerm])

//   return (
//     <div>
//       {!isTemplateVis && !isMailingListVis && 
//       <div>
//       <div className="grid grid-cols-4 my-4">
//         <div className='col-start-4'>
//           <SearchWhite HandleSearch={(e: any) => setSearchTerm(e.target.value)} />
//         </div>
//       </div>
//       <div className="relative h-[65vh] overflow-y-scroll  md:px-4 rounded-lg">
//         <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
//           <thead className="sticky top-0 text-xs text-stone-700 uppercase bg-stone-200 truncate">
//             <tr>
//               <th scope="col" className="px-6 py-4 w-64 text-left truncate">Broadcast Name</th>
//               <th scope="col" className="px-6 py-4 text-center truncate">Total Broadast</th>
//               <th scope="col" className="px-6 py-4 text-center truncate">Sent Broadast</th>
//               <th scope="col" className="px-6 py-4 text-center truncate">Broadcast Complated</th>
//               <th scope="col" className="px-6 py-4 text-center truncate">View Template</th>
//               <th scope="col" className="px-6 py-4 text-center truncate">View Contact List</th>
//               <th scope="col" className="px-6 py-4 text-center truncate">Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allbroadcasts?.map((broadcast: any, index: number) => (
//               <tr key={index} className="bg-white border-b border-stone-200">
//                 <th
//                   scope="row"
//                   className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
//                   title={broadcast.broadcastName}
//                 >
//                   {broadcast.broadcastName}
//                 </th>
//                 <td
//                   className="px-6 py-4 text-center truncate max-w-[150px]"
//                   title={broadcast.totalBroadcast}
//                 >
//                   {broadcast.totalBroadcast}
//                 </td>
//                 <td
//                   className="px-6 py-4 text-center truncate max-w-[150px]"
//                   title={broadcast.totalBroadcastSend}
//                 >
//                   {broadcast.totalBroadcastSend}
//                 </td>
//                 <td
//                   className="px-6 py-4 text-center truncate max-w-[150px]"
//                   title={String(broadcast.isBroadcastDone)}
//                 >
//                   {broadcast.isBroadcastDone ? `✅` : `❌`}
//                 </td>
//                 <td onClick={() => {
//                   setDbTemplateId(broadcast.template.id)
//                   setIsTemplateVis(true)
//                 }}
//                   className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
//                   title="preview"
//                 >
//                   View
//                 </td>
//                 <td onClick={() => {

//                   setMailingListId(broadcast.mailingList.id)
//                   setIsMailingListVis(true)
//                 }
//                 }
//                   className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
//                   title="preview"
//                 >
//                   View
//                 </td>
//                 <td className="px-4 py-2 text-center">
//                   <button
//                     onClick={async () => {
//                     }}
//                     className='text-lg text-center text-[#ED4337] cursor-pointer hover:bg-stone-200 p-2 rounded'
//                   >
//                     <MdDelete />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//       </div>
//       <Pagination
//         totalPages={totalPages}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//       />
//       </div>
//       }
//       {isTemplateVis &&
//         <BroadcastTemplatePreview dbTemplateId={dbTemplateId} />
//       }
//       {isMailingListVis && <></>
//         // <BroadcastTemplatePreview mailingListId={mailingListId} />
//       }
//     </div>
//   );
// }

// export default BroadcastView;
