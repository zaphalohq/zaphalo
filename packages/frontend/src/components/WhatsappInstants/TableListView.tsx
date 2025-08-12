import { useContext, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { InstantsContext } from '@components/Context/InstantsContext'
import { useRecoilState } from 'recoil'
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState'

const TableListView = () => {
  const {
    HandleFormVisibility,
    setFormData,
    instantsData,
    HandleDeleteInstants
  }: any = useContext(InstantsContext)
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);
  const workspaceId = currentUserWorkspace?.id;
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhook, setWebhook] = useState({
    webhookUrl : '',
    webhookToken : ''
  })
  const HandleCopy = async (dataToBeCopied : string) => {
    try {
      await navigator.clipboard.writeText(dataToBeCopied);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  return (
    <div>
      <div className="relative overflow-x-auto md:pt-4 md:p-4 rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
          <thead className="text-xs text-stone-700 uppercase bg-stone-200 truncate">
            <tr>
              <th scope="col" className="px-6 py-4 w-64 text-left truncate">Name</th>
              <th scope="col" className="px-6 py-4 text-center truncate">App ID</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Phone No ID</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Business Account ID</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Access Token</th>
              <th scope="col" className="px-6 py-4 text-center truncate">App Secret</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Webhook</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Edit</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Delete</th>
            </tr>
          </thead>
          <tbody>
            {instantsData?.map((instantsdata: any, index: number) => (
              <tr key={index} className="bg-white border-b border-stone-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
                  title={instantsdata.name}
                >
                  {instantsdata.name}
                </th>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={instantsdata.appId}
                >
                  {instantsdata.appId}
                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={instantsdata.phoneNumberId}
                >
                  {instantsdata.phoneNumberId}
                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={instantsdata.businessAccountId}
                >
                  {instantsdata.businessAccountId}
                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[200px]"
                  title={'*'.repeat(instantsdata.accessToken.length)}
                >
                  {'*'.repeat(instantsdata.accessToken.length)}

                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={'*'.repeat(instantsdata.appSecret.length)}
                >
                  {'*'.repeat(instantsdata.appSecret.length)}
                </td>
                <td onClick={() => {
                  setWebhook({ 
                    webhookUrl : `${import.meta.env.VITE_BACKEND_URL}/whatsapp/${workspaceId}/webhook`,
                    webhookToken: instantsdata.waWebhookToken
                  })
                  setShowSendPopup(true)
                }}
                  className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                  title={instantsdata.waWebhookToken}
                >
                  View
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      setFormData(instantsdata);
                      HandleFormVisibility();
                    }}
                    className='text-lg text-center text-violet-500 cursor-pointer hover:bg-stone-200 p-2 rounded'
                  >
                    <FiEdit2 />
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      HandleDeleteInstants(instantsdata.id)
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
      {showSendPopup && (
        <div className="fixed inset-0 bg-gray-800/30 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-120">
            <h2 className="text-lg text-gray-800 font-semibold mb-2">Webhook</h2>
            <p className="text-sm text-gray-600 mb-2">Webhook: <strong>Url</strong></p>
            <div className='w-full flex rounded-2xl mb-2'>
              <input className='p-4 border-none focus:outline-none focus:ring-0 focus:border-none w-full bg-gray-200 text-blue-700' type="text" name="" id="" defaultValue={webhook.webhookUrl} />
              <button onClick={() => HandleCopy(webhook.webhookUrl)} className='p-4 bg-gray-300 hover:bg-gray-400 cursor-pointer text-stone-900 font-medium'>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Webhook: <strong>Token</strong></p>
            <div className='w-full flex rounded-2xl mb-2'>
              <input className='p-4 border-none focus:outline-none focus:ring-0 focus:border-none w-full bg-gray-200 text-blue-700' type="text" name="" id="" defaultValue={webhook.webhookToken} />
              <button onClick={() => HandleCopy(webhook.webhookToken)} className='p-4 bg-gray-300 hover:bg-gray-400 cursor-pointer text-stone-900 font-medium'>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowSendPopup(false)}
                className="bg-gray-300 cursor-pointer text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableListView