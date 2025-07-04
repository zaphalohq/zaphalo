import { FiMenu } from "react-icons/fi"

const Navbar = ({ HandleToggleButton, location }: any) => {
  return (
    <div className="flex">
      <div className="bg-stone-200 w-full h-12 rounded md:rounded-2xl flex items-center justify-between p-2 md:p-5 gap-0.5">
        <button onClick={HandleToggleButton} className='cursor-pointer md:hidden hover:bg-white ' >
          <div className='text-lg'><FiMenu /></div>
        </button>
        <div className="font-bold">{location.pathname.split('/').filter(Boolean).map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}</div>
        <div className="flex  items-center pl-2">
        </div>
      </div>
    </div>
  )
}

export default Navbar
