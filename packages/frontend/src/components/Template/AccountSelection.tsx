import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { findAllInstants } from '@src/generated/graphql'

const AccountSelection = ({ templateData, handleInputChange} : any) => {
     const { data : instantsData, loading, refetch } = useQuery(findAllInstants)
        const [allInstants, setAllInstants] = useState([{
            id: "",
            name: "",
            phoneNumberId: "",
            businessAccountId: "",
            defaultSelected: false
        }])
        const HandleFetchInstants = async () => {
            try {
                const data = await instantsData
              if (data?.findAllInstants) {
                setAllInstants(data?.findAllInstants)
                refetch();
                const currentInstants = data?.findAllInstants.filter((instants : any) => instants.defaultSelected == true)
              } 
            } catch (err) {
                console.error('Error fetching data', err)
            }
    
        }
        useEffect(() => {
            HandleFetchInstants()
        }, [instantsData, templateData])
    
  return (
   <div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Account</label>
    <select
      name="accountId"
      value={templateData.accountId}
      onChange={handleInputChange}
      required
      className="mt-1 block w-full rounded-md outline-none shadow-sm p-2"
    >
      <option value="" disabled>
        -- Select Account --
      </option>
      {allInstants.map((instant: any, index) => (
        <option key={index} value={instant.id}>
          {`${instant.name} — ${instant.phoneNumberId}`}
        </option>
      ))}
    </select>
  </div>
</div>
  )
}

export default AccountSelection
