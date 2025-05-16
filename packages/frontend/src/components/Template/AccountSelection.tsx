import { useQuery } from '@apollo/client'
import { findAllInstants } from '@src/pages/Mutation/WhatsappInstants'
import { useEffect, useState } from 'react'

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
                
                // Check if data exists and has the expected structure
              if (data?.findAllInstants) {
                setAllInstants(data?.findAllInstants)
                refetch();
                const currentInstants = data?.findAllInstants.filter((instants : any) => instants.defaultSelected == true)
                console.log(data?.findAllInstants,"currentInstantscurrentInstantscurrentInstantscurrentInstants");
                
                
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
          name="account"
          value={templateData.account}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md outline-none shadow-sm p-2"
        >
          { allInstants.map((instant : any, index) => 
          <option key={index} className='p-4' value={instant.id}>
            {`${instant.name} — ${instant.phoneNumberId}`}
          </option>
        
      )}
      </select>
      </div>
    </div>
  )
}

export default AccountSelection
