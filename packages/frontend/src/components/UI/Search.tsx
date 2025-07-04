import { FiCommand, FiSearch } from 'react-icons/fi'

export const Search = () => {
  return (
    <div className='flex bg-stone-50 text-sm items-center rounded relative px-2 py-1.5'>
      <FiSearch className='mr-2'/>
      <input className='w-full focus:outline-none bg-stone-50 placeholder:text-stone-400' type="text" placeholder='Search' name="" id="" />
      <span className='flex items-center bg-stone-50 gap-0.5 rounded p-1 absolute right-1.5'>
      <FiCommand />K
      </span>
    </div>
  )
}


export const SearchWhite = ({ HandleSearch } : any) => {
  return (
    <div className='flex bg-gray-200 text-sm items-center rounded relative px-2 py-1.5'>
      <FiSearch className='mr-2'/>
      <input onChange={HandleSearch} className='w-full focus:outline-none bg-gray-200 placeholder:text-stone-400' type="text" placeholder='Search' name="" id="" />
      <span className='flex items-center bg-stone-200 gap-0.5 rounded p-1 absolute right-1.5'>
      <FiCommand />K
      </span>
    </div>
  )
}



