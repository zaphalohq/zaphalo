import { use, useContext, useEffect, useRef, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { ContactsContext } from '@components/Context/ContactsContext';
import { Input } from "@src/components/UI/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@src/components/UI/select';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Button } from '@src/components/UI/button';
import { Delete, Plus, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@src/components/UI/table";
import { DeleteContact, SearchReadContacts } from '@src/generated/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';

const ContactsList = ({
    showForm,
    setIsNewContacts,
    setContact,
    onCreate
}) => {

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);


    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    }


    const { data: contactData, loading: loadingData, error, refetch } = useQuery(SearchReadContacts, {
        variables: { page, pageSize, search, filter },
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await refetch();
            setLoading(false);
        };
        fetchData();
    }, [debouncedSearch, filter, page]);


    const contactsData = contactData?.searchReadContacts?.contacts || [];

    const totalPages = contactData?.searchReadContacts?.totalPages || 0;


    // {Delete contact}
    const [deleteContact, { error: deleteError }] = useMutation(DeleteContact);
    const HandleDeleteContacts = async () => {
        try {
            for (const id of selected) {
                await deleteContact({ variables: { contactId: id } });
                toast.success('Contact deleted successfully');
            }
            await refetch();
        } catch (err) {
            console.error("error deleting multiple contacts", err)
        }
    }

    return (
        <div className="relative overflow-x-auto md:pt-4 md:p-4 rounded-lg space-y-6">
            <div className="flex justify-between items-center">
                {/*<h1 className="text-2xl font-bold"></h1>*/}
                <PageHeader
                    title="Contacts Overview"
                    className="w-full"
                    actions={
                        <>
                            <Button
                                onClick={() => onCreate()}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Contact
                            </Button>
                            {selected.length > 0 && (
                                <button
                                    onClick={async () => {
                                        await HandleDeleteContacts();
                                        setSelected([]);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete ({selected.length})
                                </button>
                            )}
                        </>
                    }
                />
            </div>
            <div className="flex gap-4 items-center">
                <Input
                    ref={searchRef}
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="max-w-sm"
                />
                {/* <Select value={filter} onValueChange={(val) => setFilter(val)}>
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
                </Select> */}
            </div>

            {/* Table List View */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
                    <TableHeader className="text-black">
                        <TableRow className="bg-gray-100 uppercase text-sm font-semibold">
                            <TableHead className="px-4 py-3"></TableHead>
                            <TableHead className="px-4 py-3">Contact Name</TableHead>
                            <TableHead className="px-4 py-3">Contact Number</TableHead>
                            <TableHead className="px-4 py-3">Country</TableHead>
                            <TableHead className="px-4 py-3">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-black">
                        {contactsData?.map((contactData) => (
                            <TableRow
                                key={contactData.id}
                                className="bg-white border-b border-stone-200"
                            >
                                <TableCell className="px-4 py-5">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(contactData.id)}
                                        onChange={() => toggleSelect(contactData.id)}
                                    />
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
                                    title={contactData.contactName}
                                >
                                    {contactData.contactName}
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 text-left truncate max-w-[150px]"
                                    title={String(contactData.phoneNo)}
                                >
                                    {contactData.phoneNo}
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 text-left truncate max-w-[200px]"
                                    title={contactData?.address || 'N/A'}
                                >
                                    {contactData?.address.country || 'N/A'}
                                </TableCell>
                                <TableCell className="px-4 py-2 text-left">
                                    <button
                                        onClick={() => {
                                            setContact(contactData.id);
                                            showForm(true);
                                            setIsNewContacts(false);
                                        }}
                                        className="text-lg text-center text-blue-500 hover:text-blue-700 cursor-pointer hover:bg-stone-200 p-2 rounded"
                                    >
                                        <FiEdit2 />
                                    </button>
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
};

export default ContactsList;
