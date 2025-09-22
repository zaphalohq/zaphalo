import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { Input } from "@src/components/UI/input";
import { Button } from "@src/components/UI/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/UI/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";
import usePagination from '@src/utils/usePagination';
import BroadcastTemplatePreview from '@src/components/Broadcast/BroadcastTemplatePreview';
import { Trash2 } from "lucide-react";
import { SearchedBroadcast, SearchReadWhatsappTemplate, WaTestTemplate } from '@src/generated/graphql';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Plus } from "lucide-react";
import { formatLocalDate } from '@src/utils/formatLocalDate';


const statusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function TemplateList({
  onCreate,
  showForm,
  setReadOnly,
  setRecord,
}) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [testTemplateData, setTestTemplateData] = useState({
    dbTemplateId: '',
    testPhoneNo: '',
    templateName: ''
  });
  const [showSendPopup, setShowSendPopup] = useState(false);

  const { data, loading: loadingData, refetch } = useQuery(SearchReadWhatsappTemplate, {
    variables: { page, pageSize, search, filter },
    fetchPolicy: "cache-and-network",
  });

  const [testTemplate] = useMutation(WaTestTemplate);

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


  const templates = data?.searchReadTemplate.templates || [];

  const totalPages = data?.searchReadTemplate.totalPages || 1;


  const handleSendTemplateToPhone = async (templateId: string) => {
      if (!testTemplateData.testPhoneNo.trim()) {
          alert("Please enter a phone number.");
          return;
      }
      const response = await testTemplate({
          variables: {
              testTemplateData
          }
      })
      setShowSendPopup(false);
      setTestTemplateData({
          dbTemplateId: '',
          testPhoneNo: '',
          templateName: ''
      });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/*<h1 className="text-2xl font-bold"></h1>*/}
        <PageHeader title="WhatsApp Templates" className="w-full"
        actions={
          <>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Template
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
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
              <TableHead className="px-4 py-3">Category</TableHead>
              <TableHead className="px-4 py-3">Account</TableHead>
              <TableHead className="px-4 py-3">Create on</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3"></TableHead>
              <TableHead className="px-4 py-3">Template</TableHead>
              <TableHead className="px-4 py-3">Contact List</TableHead>
              <TableHead className="px-4 py-3">Test</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-black">
            {templates.length > 0 ? (
              templates.map((template) => (
                <TableRow key={template.id} className="bg-white border-b border-stone-200">
                  <TableCell className="px-4 py-5">
                    <input
                      type="checkbox"
                      checked={selected.includes(template.id)}
                      onChange={() => toggleSelect(template.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-5">{template.templateName}</TableCell>
                  <TableCell className="px-4 py-5">{template.category}</TableCell>
                  <TableCell className="px-4 py-5">{template?.account?.name}</TableCell>
                  <TableCell className="px-4 py-5">{
                    formatLocalDate(template.createdAt)
                  }</TableCell>
                  <TableCell className="px-4 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[template.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {template.status}
                    </span>
                  </TableCell>
                  <TableCell onClick={() => {
                    template.status != 'New' ? setReadOnly(true) : setReadOnly(false)
                    setRecord(template.id)
                    showForm(true)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="preview"
                  >
                      Edit
                  </TableCell>
                  <TableCell onClick={() => {
                    setRecord(template.id)
                    // setShowTemplate(true)
                    setReadOnly(true)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="preview"
                  >
                    <BroadcastTemplatePreview dbTemplateId={template.id}/>
                  </TableCell>
                  <TableCell onClick={() => {
                    setMailingListId(template.id)
                    setIsMailingListVis(true)
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="preview"
                  >
                    View
                  </TableCell>
                  <TableCell onClick={() => {
                    setShowSendPopup(true);
                    setTestTemplateData((prev) => ({
                      ...prev,
                      dbTemplateId: template.id,
                      templateName: template.templateName
                    }))
                  }}
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="Test Template"
                  >
                    Test
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

{showSendPopup && (
                <div className="fixed inset-0 bg-gray-800/30 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-lg text-gray-800 font-semibold mb-2">Test Template</h2>
                        <p className="text-sm text-gray-600 mb-4">Template: <strong>{testTemplateData.templateName}</strong></p>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Phone No</label>
                        <input
                            name='testPhoneNo'
                            type="text"
                            value={testTemplateData.testPhoneNo}
                            onChange={(e) => setTestTemplateData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value
                            }))}
                            placeholder="Enter phone number"
                            className="w-full p-2 border rounded-md mb-4 text-sm"
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowSendPopup(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSendTemplateToPhone("showSendPopup.id")}
                                className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
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