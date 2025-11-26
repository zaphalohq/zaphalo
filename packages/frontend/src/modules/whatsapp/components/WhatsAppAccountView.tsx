import { useContext, useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { DeleteInstantsMutation, searchReadAccount } from '@src/generated/graphql';
import { FiEdit2 } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { InstantsContext } from '@components/Context/InstantsContext';
import { useRecoilState } from 'recoil';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@src/components/UI/table';
import { Trash2 } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Input } from '@src/components/UI/input';
import { Button } from '@src/components/UI/button';
import { PageHeader } from '../../ui/layout/page/components/PageHeader';
import { toast } from 'react-toastify';

const WhatsAppAccountView = ({ onCreate, setwaAccount, setisFormVisible }) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const workspaceId = currentUserWorkspace?.id;
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhook, setWebhook] = useState({
    webhookUrl: '',
    webhookToken: '',
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const HandleCopy = async (dataToBeCopied: string) => {
    try {
      await navigator.clipboard.writeText(dataToBeCopied);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const { data: accountData, loading: loadingData, refetch } = useQuery(searchReadAccount, {
    variables: { page, pageSize, search },
    fetchPolicy: 'cache-and-network',
  });

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
  }, [debouncedSearch, page]);

  const instantsData = accountData?.searchReadAccount.accounts || []

  const [DeleteInstants] = useMutation(DeleteInstantsMutation);
  const deleteSelected = () => {
    selected.map(async (id) => {
      for (const id of selected) {
        try {
          await DeleteInstants({
            variables: { waAccountId: id },
          });
          setSelected([]);
          refetch();
          toast.success("Account Deleted")
        } catch (err) {
          console.error("Error deleting account", err);
        }
      }
    })
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          {/*<h1 className="text-2xl font-bold"></h1>*/}
          <PageHeader title="WhatsApp Accounts" className="w-full"
            actions={
              <>
                <Button
                  onClick={onCreate}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
            <TableHeader className="text-black">
              <TableRow className="bg-gray-100 text-sm font-semibold">
                <TableHead className="px-4 py-2"></TableHead>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">App ID</TableHead>
                <TableHead className="px-4 py-2">Phone No ID</TableHead>
                <TableHead className="px-4 py-2">Business Account ID</TableHead>
                <TableHead className="px-4 py-2">Access Token</TableHead>
                <TableHead className="px-4 py-2">App Secret</TableHead>
                <TableHead className="px-4 py-2">Webhook</TableHead>
                <TableHead className="px-4 py-2">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-black">
              {instantsData?.map((instantsdata: any, index: number) => (
                <TableRow
                  key={index}
                  className="bg-white border-b border-stone-200"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(instantsdata.id)}
                      onChange={() => toggleSelect(instantsdata.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-5 font-medium text-left text-stone-900 max-w-[200px]">
                    {instantsdata.name}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {instantsdata.appId}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {instantsdata.phoneNumberId}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {instantsdata.businessAccountId}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {'*'.repeat(Math.min(instantsdata.accessToken.length, 15))}
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    {'*'.repeat(Math.min(instantsdata.accessToken.length, 10))}
                  </TableCell>
                  <TableCell
                    className="px-6 py-4 text-left truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => {
                      setWebhook({
                        webhookUrl: `${import.meta.env.VITE_BACKEND_URL
                          }/whatsapp/${workspaceId}/webhook`,
                        webhookToken: instantsdata.waWebhookToken,
                      });
                      setShowSendPopup(true);
                    }}
                  >
                    View
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    <button
                      onClick={() => {
                        setwaAccount(instantsdata.id)
                        setisFormVisible(true)
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
      </div>
      {showSendPopup && (
        <div className="fixed inset-0 bg-gray-800/30 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-120">
            <h2 className="text-lg text-gray-800 font-semibold mb-2">
              Webhook
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>URL</strong>
            </p>
            <div className="w-full flex rounded-2xl mb-2">
              <input
                className="p-4 border-none focus:outline-none focus:ring-0 focus:border-none w-full bg-gray-200 text-blue-700"
                type="text"
                name=""
                id=""
                defaultValue={webhook.webhookUrl}
              />
              <button
                onClick={() => HandleCopy(webhook.webhookUrl)}
                className="p-4 bg-green-500 hover:bg-green-600 cursor-pointer text-white font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Token</strong>
            </p>
            <div className="w-full flex rounded-2xl mb-2">
              <input
                className="p-4 border-none focus:outline-none focus:ring-0 focus:border-none w-full bg-gray-200 text-blue-700"
                type="text"
                name=""
                id=""
                defaultValue={webhook.webhookToken}
              />
              <button
                onClick={() => HandleCopy(webhook.webhookToken)}
                className="p-4 bg-green-500 hover:bg-green-600 cursor-pointer text-white font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowSendPopup(false)}
                className="bg-rose-500 cursor-pointer text-white px-4 py-1 rounded hover:bg-rose-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppAccountView;
