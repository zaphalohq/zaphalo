import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@src/components/UI/button";
import { Input } from "@src/components/UI/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/UI/table";
import { DeleteMailingContact, FindAllMailingContacts } from "@src/generated/graphql";
import { currentUserWorkspaceState } from "@src/modules/auth/states/currentUserWorkspaceState";
import { PageHeader } from "@src/modules/ui/layout/page/components/PageHeader";
import { Breadcrumb } from "@src/modules/ui/navigation/bread-crumb/components/Breadcrumb";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

const MailingContactsList = ({ selectedListId, setSelectedListId }) => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);


    const { data: mailingContactdata,
        loading: mailingContactLoading,
        refetch: mailingContactRefetch,
        error: mailingContactError } = useQuery(FindAllMailingContacts, {
            variables: {
                mailingListId: selectedListId, page, pageSize, search
            },
            skip: !selectedListId
        });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setLoading(true);
        mailingContactRefetch({ page, pageSize, search })
            .finally(() => setLoading(false));
        setLoading(false);
    }, [debouncedSearch, page]);

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    
    const [deleteMailingContact, { error }] = useMutation(DeleteMailingContact)
    const deleteSelected = async () => {
        try {
            for (const id of selected) {
                await deleteMailingContact({ variables: { mailingContactId: id } });
                toast.success('Mailing list deleted successfully');
            }
            await mailingContactRefetch();
        } catch (err) {
            console.error("error deleting multiple contacts", err)
        }
    }

    const malingContacts = mailingContactdata?.findAllMailingContacts.MailingContacts || []
    const totalPages = mailingContactdata?.findAllMailingContacts.totalPages || 1

    return (
        <div className="p-6 space-y-6">
            <nav className="text-sm text-gray-600 mb-4">
                <ol className="flex items-center space-x-2">
                    <li>
                        <button
                            onClick={() => setSelectedListId(null)}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Contacts List
                        </button>
                    </li>
                    <li>
                        <span>/</span>
                    </li>
                    <li className="text-gray-500">Contact Details</li>
                </ol>
            </nav>

            <div className="flex justify-between items-center">
                <PageHeader title="Contacts" className="w-full"
                    actions={
                        <>
                            <Button
                            // onClick={() => }
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
                            <TableRow className="bg-gray-100 uppercase text-sm font-semibold">
                                <TableHead className="px-4 py-2"></TableHead>
                                <TableHead className="px-4 py-3">Contact Name</TableHead>
                                <TableHead className="px-4 py-3">Contacts Number</TableHead>
                                <TableHead className="px-4 py-3">Mailing List</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-black">
                            {malingContacts?.map((mailingContact: any, index: number) => (
                                <TableRow key={index} className="bg-white border-b border-stone-200">
                                    <TableCell className="px-4 py-5">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(mailingContact.id)}
                                            onChange={() => toggleSelect(mailingContact.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        {mailingContact.contactName}
                                    </TableCell>
                                    <TableCell className="px-4 py-5 text-blue-500">
                                        {mailingContact.contactNo}
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        {mailingContact.mailingList.mailingListName}
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
    )
}

export default MailingContactsList