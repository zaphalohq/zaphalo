import { getItem } from "@utils/localStorage"

const AccountToggle = () => {
    const user = getItem('userDetails')
    const workspaceIds = getItem('workspaceIds')
    return (
        <div className="border-b mt-2 mb-4 pb-4 border-stone-300 ">
            <button className="flex p-0.5 hover:bg-stone-200 rounded w-full  items-start gap-2 transition-colors relative">
                {/* <img
                    className="size-8 rounded shrink-0 bg-violet-500 shadow"
                    src="https://api.dicebear.com/9.x/icons/svg?seed=Leo"
                    alt="avatar" /> */}
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Y</span>
                </div>
                <div className="text-start">
                    <span className="font-bold text-sm block">{user.name}</span>
                    <span className="block text-xs text-stone-500">{user.email}</span>
                </div>
                {/* { <FiChevronLeft className="absolute top-3 right-2" />
                : <FiChevronRight className="absolute top-3 right-2"/>} */}
                
            </button>
            <div className="flex flex-col gap-2 pt-2">
                {/* <select name="" id=""> */}
                    {workspaceIds.map((workspaceId : string) => 
                    
                //         <option value="">
                //             <div className="text-start">
                //     <span className="font-bold text-sm block">{user.name}</span>
                //     <span className="block text-xs text-stone-500">{user.email}</span>
                // </div>
                //         </option>

                   
                    
                
                        <div 
                        onClick={() => {
                            sessionStorage.setItem('workspaceId', workspaceId)
                            window.location.reload()
                        }}
                        className="bg-gray-300 p-2 hover:bg-gray-400 cursor-pointer">{workspaceId}</div>
                        )}
                         {/* </select> */}
                </div>
        </div>

    )
}

export default AccountToggle
