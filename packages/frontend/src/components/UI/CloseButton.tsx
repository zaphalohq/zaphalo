import { FiX } from "react-icons/fi"

const CloseButton = ({onClick, top, right} : any) => {
    return (
        <div className={`absolute ${right} ${top} p-0.5 `}>
            <button onClick={onClick} className="cursor-pointer hover:bg-stone-200 text-3xl 
                               rounded-full p-1 text-center text-violet-500
                             bg-stone-50">
                <FiX />
            </button>
        </div>
    )
}

export default CloseButton
