import { useContext } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { InstantsContext } from '@components/Context/InstantsContext'

const TableListView = () => {
  const {
    HandleFormVisibility,
    setFormData,
    instantsData,
    DeleteInstants,
    data,
    refetch,
    setInstantsData,
    HandleDeleteInstants
  }: any = useContext(InstantsContext)
  return (
    <div>
      <div className="relative overflow-x-auto md:pt-4 md:p-4 rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
          <thead className="text-xs text-stone-700 uppercase bg-stone-200 truncate">
            <tr>
              <th scope="col" className="px-6 py-4 w-64 text-left truncate">Name</th>
              <th scope="col" className="px-6 py-4 text-center truncate">App ID</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Phone Number ID</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Business Account ID</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Access Token</th>
              <th scope="col" className="px-6 py-4 text-center truncate">App Secret</th>
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
                  title={instantsdata.accessToken}
                >
                  {instantsdata.accessToken}
                </td>
                <td
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={instantsdata.appSecret}
                >
                  {'*'.repeat(instantsdata.appSecret.length)}
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
                    onClick={async () => {
                      HandleDeleteInstants(
                        instantsdata.id,
                        DeleteInstants,
                        data,
                        refetch,
                        setInstantsData
                      )
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
    </div>
  )
}

export default TableListView