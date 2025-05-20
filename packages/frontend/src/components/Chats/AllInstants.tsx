import { useEffect, useState } from 'react'
import { SearchWhite } from '@UI/Search'
import { useMutation, useQuery } from '@apollo/client'
import { findAllInstants } from '@pages/Mutation/WhatsappInstants'
import { InstantsSelection } from '@pages/Mutation/Chats'


const AllInstants = () => {
    //--------------------------findAllContacts-----------------------------
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
            console.log(currentInstants,"currentInstantscurrentInstantscurrentInstantscurrentInstants");
            
            
          } else {
            console.error('No data returned from mutation');
          }
        } catch (err) {
            console.error('Error fetching data', err)
        }

    }
    useEffect(() => {
        HandleFetchInstants()
    }, [instantsData])

    const [searchedInstantsChar, setSearchInstantsChar] = useState("")
    const [filteredInstants, setFilteredInstants] = useState(allInstants); // New state for filtered results
    useEffect(() => {

        if (!searchedInstantsChar) {
            setFilteredInstants(allInstants); // Reset to all channels if search is empty
            return;
        }
        const searchedInstants = allInstants?.filter((instants: any) =>
            instants.name
                .toLowerCase()
                .startsWith(searchedInstantsChar.toLowerCase() || "") // Search by first character
        );
        setFilteredInstants(searchedInstants);

    }, [searchedInstantsChar, allInstants])

    const [ instantsSelection ] = useMutation(InstantsSelection)
    const HandleInstantsSelection = async (instantsId: string) => {
        try {
          // Execute the mutation and await the result
          const { data } = await instantsSelection({
            variables: { instantsId },
          });
    
          // Check if data exists and has the expected structure
          if (data?.InstantsSelection) {
            console.log(data.InstantsSelection);
            setAllInstants(data.InstantsSelection);
          } else {
            console.error('No data returned from mutation');
          }
        } catch (error) {
          console.error('Mutation error:', error);
          // Handle the error (e.g., show a user-friendly message)
        }
      };

    return (
        <div className="absolute rounded top-10 md:left-4 z-20 right-[0] bg-white shadow-2xl py-4 w-[40vh]">
            <div className="text-lg font-semibold px-4 ">Whatsapp Instants</div>
            <div className="px-4 py-3 ">
                <SearchWhite HandleSearch={(event: any) => setSearchInstantsChar(event.target.value)} />
            </div>
            <div className="overflow-y-scroll h-[50vh]">
                <div className="px-4 p-2 bg-gray-100 font-medium sticky top-0 border-b border-gray-300">All Instants</div>
                {filteredInstants?.map((instants, index) => (
                    <div key={index}>
                    {instants.defaultSelected == true ?
                        <div onClick={() => HandleInstantsSelection(instants.id)} className="bg-gray-300 w-full hover:bg-gray-300 cursor-pointer flex gap-3 px-4 items-center p-2.5 border-b border-gray-300">
                            <div className="w-11 h-11 bg-blue-200 rounded-full 
                       flex justify-center text-blue-500 font-bold text-lg 
                       items-center">
                                {instants.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className='flex flex-col'>
                                <span className="font-semibold text-lg">{instants.name}</span>
                                <div className='text-sm font-semibold text-gray-700'>{instants.phoneNumberId}</div>
                            </div>
                        </div>
                        :
                        <div onClick={() => HandleInstantsSelection(instants.id)} key={index} className="bg-gray-100 w-full hover:bg-gray-300 cursor-pointer flex gap-3 px-4 items-center p-2.5 border-b border-gray-200">
                            <div className="w-11 h-11 bg-blue-200 rounded-full 
                       flex justify-center text-blue-500 font-bold text-lg 
                       items-center">
                                {instants.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className='flex flex-col'>
                                <span className="font-semibold text-lg">{instants.name}</span>
                                <div className='text-sm font-semibold text-gray-700'>{instants.phoneNumberId}</div>
                            </div>
                        </div>
                    }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllInstants

