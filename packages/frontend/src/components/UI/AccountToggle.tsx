import { getItem } from "../utils/localStorage"

const AccountToggle = () => {
    const workspaceId = getItem('workspaceIds')
    
    return (
        <div className="border-b mt-2 mb-4 pb-4 border-stone-300 ">
            <button className="flex p-0.5 hover:bg-stone-200 rounded w-full  items-start gap-2 transition-colors relative">
                <img
                    className="size-8 rounded shrink-0 bg-violet-500 shadow"
                    src="https://api.dicebear.com/9.x/icons/svg?seed=Leo"
                    alt="avatar" />
                <div className="text-start">
                    <span className="font-bold text-sm block">Chintan</span>
                    <span className="block text-xs text-stone-500">chinta@gmail.com</span>
                </div>
                {/* { <FiChevronLeft className="absolute top-3 right-2" />
                : <FiChevronRight className="absolute top-3 right-2"/>} */}
            </button>
        </div>

    )
}

export default AccountToggle
