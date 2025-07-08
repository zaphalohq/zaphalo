import { useContext, useEffect } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { ContactsContext } from '@components/Context/ContactsContext'

const ContactsTable = () => {
  const {
    contactsData,
    setContactFormData,
    HandleDeleteContacts,
    HandleContactsFormVisibility,
		setIsNewContacts

  } : any = useContext(ContactsContext)

  return (
    <div>
      <div className="relative overflow-x-auto md:pt-4 md:p-4 rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
          <thead className="text-xs text-stone-700 uppercase bg-stone-200 truncate">
            <tr>
              <th scope="col" className="px-6 py-4 w-64 text-left truncate">contact Name</th>
              <th scope="col" className="px-6 py-4 text-center truncate">contact Number</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Edit</th>
              <th scope="col" className="px-6 py-4 text-center truncate">Delete</th>
            </tr>
          </thead>
          <tbody>
            {contactsData?.map((contactData: any, index: number) => (
              <tr key={index} className="bg-white border-b border-stone-200">
                <th 
                  scope="row" 
                  className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
                  title={contactData.contactName}
                >
                  {contactData.contactName}
                </th>
                <td 
                  className="px-6 py-4 text-center truncate max-w-[150px]"
                  title={String(contactData.phoneNo)}
                >
                  {contactData.phoneNo}
                </td>
                <td className="px-4 py-2 text-center">
                  <button 
                    onClick={() => {
                      setContactFormData(contactData);
                      setIsNewContacts(false)
                      HandleContactsFormVisibility();
                    }} 
                    className='text-lg text-center text-violet-500 cursor-pointer hover:bg-stone-200 p-2 rounded'
                  >
                    <FiEdit2 />
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button 
                    onClick={async() => {
                      HandleDeleteContacts(contactData.id)
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

export default ContactsTable