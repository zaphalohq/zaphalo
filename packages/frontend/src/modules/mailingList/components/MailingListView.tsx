import { useMutation, useQuery } from '@apollo/client';
import { deleteMailingListWithAllContacts, RegisterMutation, searchMailingList, searchReadMailingList } from '@src/generated/graphql';
import { useEffect, useRef, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import MailingContactsList from './MailingContactsList';
import usePagination from '@src/utils/usePagination';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Input } from "@src/components/UI/input";
import { Button } from "@src/components/UI/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/UI/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import MailingContactForm from './MailingContactForm';

export default function MailingListView({ onCreate, setIsMailingContactVis, isMailingContactVis }: any) {

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string | null>(null);
  const [isMailingContactFormVis, setIsMailingContactFormVis] = useState(false)
  const [selectedContactId, setSelectedContactId]= useState<string | null>(null)

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const { data: mailingListData,
    loading: mailingListLoading,
    refetch: mailingListRefetch } = useQuery(searchReadMailingList, {
      variables: {
        page, pageSize, search, filter
      },
      fetchPolicy: 'cache-and-network',
    });

  const [deleteMailingList, { error }] = useMutation(deleteMailingListWithAllContacts)
  const deleteSelected = async () => {
    try {
      for (const id of selected) {
        await deleteMailingList({ variables: { mailingId: id } });
        toast.success('Mailing list deleted successfully');
      }
      await mailingListRefetch();
    } catch (err) {
      console.error("error deleting multiple contacts", err)
    }
  }


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    mailingListRefetch({ page, pageSize, search, filter })
      .finally(() => setLoading(false));
    setLoading(false);
  }, [debouncedSearch, filter, page, selectedListId]);

  const malingListData = mailingListData?.searchReadMailingList.mailingList || []
  const totalPages = mailingListData?.searchReadMailingList.totalPages || 1

  if (selectedListId !== null) {
    return (
      <div className="min-h-screen bg-gray-50">
        {isMailingContactFormVis ? (
          <MailingContactForm
            selectedListName={selectedListName}
            selectedListId={selectedListId}
            selectedContactId={selectedContactId}
            onBack={() => {
              setIsMailingContactFormVis(false);
              setSelectedContactId(null)
            }} />
        ) : (
          <MailingContactsList
            selectedListId={selectedListId}
            setSelectedListId={setSelectedListId}
            setSelectedContactId={setSelectedContactId}
            onCreateOrUpdate={() => {
              setIsMailingContactFormVis(true);
            }}
          />
        )}
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Conntact List" className="w-full"
          actions={
            <>
              <Button
                onClick={onCreate}
              >
                <Plus className="w-4 h-4 mr-2" />
                Import
              </Button>
              {selected.length > 0 && (
                <button
                  onClick={async () => {
                    await deleteSelected();
                    setSelected([]);
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selected.length})
                </button>
              )}
            </>
          } />
      </div>
      <div className="flex gap-4 items-center">
        <Input
          ref={searchRef}
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value)
          }}
          className="max-w-sm"
        />
      </div>
      {
        loading ? (
          <p>Loading...</p>
        ) : (
          <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
            <TableHeader className="text-black">
              <TableRow className="bg-gray-100 text-sm font-semibold">
                <TableHead className="px-4 py-2"></TableHead>
                <TableHead className="px-4 py-3">Contact List Name</TableHead>
                <TableHead className="px-4 py-3">Total Contacts</TableHead>
                <TableHead className="px-4 py-3">Created Date</TableHead>
                <TableHead className="px-4 py-3">BroadCasts</TableHead>
                <TableHead className="px-4 py-3">View Contacts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-black">
              {malingListData?.map((mailingList: any, index: number) => (
                <TableRow key={index} className="bg-white border-b border-stone-200">
                  <TableCell className="px-4 py-5">
                    <input
                      type="checkbox"
                      checked={selected.includes(mailingList.id)}
                      onChange={() => toggleSelect(mailingList.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {mailingList.mailingListName}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {mailingList.totalContacts}
                  </TableCell>
                  <TableCell
                    className="px-4 py-5"
                  >
                    {new Date(Number(mailingList.createdAt)).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {mailingList.broadcast.length}
                  </TableCell>
                  <TableCell onClick={() => {
                    setSelectedListId(mailingList.id)
                    setSelectedListName(mailingList.mailingListName)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    View
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      <div className="flex justify-between items-center p-3 border-t bg-gray-50">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

  );
}