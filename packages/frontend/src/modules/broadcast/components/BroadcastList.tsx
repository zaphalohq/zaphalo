import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';

import { Input } from "@src/components/UI/input";
import { Button } from "@src/components/UI/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/UI/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";
import usePagination from '@src/utils/usePagination';
import BroadcastTemplatePreview from '@src/components/Broadcast/BroadcastTemplatePreview';
import { Trash2 } from "lucide-react";
import { findAllBroadcasts, SearchedBroadcast, SearchReadBroadcast } from '@src/generated/graphql';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Plus } from "lucide-react";
import { formatLocalDate } from '@src/utils/formatLocalDate';


export default function BroadcastList({
  onCreate,
  showForm,
  setReadOnly,
  setBroadcast,
}) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const { data, loading: loadingData, refetch } = useQuery(SearchReadBroadcast, {
    variables: { page, pageSize, search, filter },
    fetchPolicy: "cache-and-network",
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    setItems((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    refetch();
    setLoading(false);
  }, [debouncedSearch, filter, page]);


  const broadcasts = data?.searchReadBroadcast.broadcasts || [];

  const totalPages = data?.searchReadBroadcast.totalPages || 1;

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
             {selected.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selected.length})
                </button>
              )}
          </>
        }/>
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
        <Select value={filter} onValueChange={(val) => setFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table List View */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
          <TableHeader className="text-black">
            <TableRow className="bg-gray-100 uppercase text-sm font-semibold">
              <TableHead className="px-4 py-2"></TableHead>
              <TableHead className="px-4 py-3">Name</TableHead>
              <TableHead className="px-4 py-3">Account</TableHead>
              <TableHead className="px-4 py-3">Template</TableHead>
              <TableHead className="px-4 py-3">Create on</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3"></TableHead>
              <TableHead className="px-4 py-3">Template</TableHead>
              <TableHead className="px-4 py-3">Contact List</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-black">
            {broadcasts.length > 0 ? (
              broadcasts.map((broadcast) => (
                <TableRow key={broadcast.id} className="bg-white border-b border-stone-200">
                  <TableCell className="px-4 py-5">
                    <input
                      type="checkbox"
                      checked={selected.includes(broadcast.id)}
                      onChange={() => toggleSelect(broadcast.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-5">{broadcast.name}</TableCell>
                  <TableCell className="px-4 py-5">{broadcast.whatsappAccount.name}</TableCell>
                  <TableCell className="px-4 py-5">{broadcast.template.templateName}</TableCell>
                  <TableCell className="px-4 py-5">{
                    formatLocalDate(broadcast.createdAt)
                  }</TableCell>
                  <TableCell className="px-4 py-5">{broadcast.status}</TableCell>
                  <TableCell onClick={() => {
                    broadcast.status != 'New' ? setReadOnly(true) : setReadOnly(false)
                    setBroadcast(broadcast.id)
                    showForm(true)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="preview"
                  >
                      Edit
                    {/*<BroadcastTemplatePreview dbTemplateId={broadcast.template.id}/>*/}
                  </TableCell>
                  <TableCell onClick={() => {
                    setDbTemplateId(broadcast.template.id)
                    setShowTemplate(true)
                    setReadOnly(true)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="preview"
                  >
                    <BroadcastTemplatePreview dbTemplateId={broadcast.template.id}/>
                  </TableCell>
                  <TableCell onClick={() => {
                    setMailingListId(broadcast.mailingList.id)
                    setIsMailingListVis(true)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
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
      )}
       {/* Pagination */}
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