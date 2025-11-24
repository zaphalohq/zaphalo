import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { SearchWhite } from '@components/UI/Search'
import { cookieStorage } from '@src/utils/cookie-storage';
import { searchReadAccount } from '@src/generated/graphql';

const ShowWaAccounts = () => {
    const [search, setSearch] = useState('');
    const [selectedWaAccount, setSelectedWaAccount] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data: accountData, loading: loadingData, refetch } = useQuery(searchReadAccount, {
        variables: { page: 1, pageSize: 20, search: debouncedSearch },
        fetchPolicy: 'cache-and-network',
    });
    const waAccounts = accountData?.searchReadAccount.accounts || []
    if (waAccounts.length>0 && cookieStorage.getItem('waid')){
        const account = waAccounts.find(acc => acc.id === cookieStorage.getItem('waid'));
        if (!account){
            cookieStorage.removeItem('waid');
        }
    }
    if (cookieStorage.getItem('waid') != selectedWaAccount)
        setSelectedWaAccount(cookieStorage.getItem('waid'))

    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        refetch();
    }, [debouncedSearch, selectedWaAccount]);

    const HandleInstantsSelection = async (instantsId: string) => {
        cookieStorage.setItem(
            'waid', instantsId
          );
        setSelectedWaAccount(cookieStorage.getItem('waid'))
        refetch();
    };

    return (
        <div className="absolute rounded top-10 md:left-4 z-20 right-[0] bg-white shadow-2xl py-4 w-[40vh]">
            <div className="text-lg font-semibold px-4 ">Whatsapp Accounts</div>
            <div className="px-4 py-3 ">
                <SearchWhite HandleSearch={(event: any) => setSearch(event.target.value)} />
            </div>
        {loadingData ? (
          <p>Loading...</p>
        ) : 
         ( <div className="overflow-y-scroll h-[50vh]">
                <div className="px-4 p-2 bg-gray-100 font-medium sticky top-0 border-b border-gray-300">All Accounts</div>
                {waAccounts?.map((waAccount: any, index: number) => (
                    <div key={index}>
                        {waAccount.id === selectedWaAccount ?
                            <div onClick={() => HandleInstantsSelection(waAccount.id)} className="bg-gray-300 w-full hover:bg-gray-300 cursor-pointer flex gap-3 px-4 items-center p-2.5 border-b border-gray-300">
                                <div className="w-11 h-11 bg-blue-200 rounded-full 
                       flex justify-center text-blue-500 font-bold text-lg 
                       items-center">
                                    {waAccount?.name?.slice(0, 1).toUpperCase()}
                                </div>
                                <div className='flex flex-col'>
                                    <span className="font-semibold text-lg">{waAccount.name}</span>
                                    <div className='text-sm font-semibold text-gray-700'>{waAccount.phoneNumberId}</div>
                                </div>
                            </div>
                            :
                            <div onClick={() => HandleInstantsSelection(waAccount.id)} key={index} className="bg-gray-100 w-full hover:bg-gray-300 cursor-pointer flex gap-3 px-4 items-center p-2.5 border-b border-gray-200">
                                <div className="w-11 h-11 bg-blue-200 rounded-full 
                       flex justify-center text-blue-500 font-bold text-lg 
                       items-center">
                                    {waAccount?.name?.slice(0, 1).toUpperCase()}
                                </div>
                                <div className='flex flex-col'>
                                    <span className="font-semibold text-lg">{waAccount.name}</span>
                                    <div className='text-sm font-semibold text-gray-700'>{waAccount.phoneNumberId}</div>
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div> )}
        </div>
    )
}

export default ShowWaAccounts

