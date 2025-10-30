import { FiCommand, FiSearch } from 'react-icons/fi'

export const Search = () => {
  return (
    <div className='flex bg-stone-50 text-sm items-center rounded relative px-2 py-1.5'>
      <FiSearch className='mr-2' />
      <input className='w-full focus:outline-none bg-stone-50 placeholder:text-stone-400' type="text" placeholder='Search' name="" id="" />
      <span className='flex items-center bg-stone-50 gap-0.5 rounded p-1 absolute right-1.5'>
        <FiCommand />K
      </span>
    </div>
  )
}


export const SearchWhite = ({ HandleSearch }: any) => {
  return (
    <input onChange={HandleSearch} className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50' type="text" placeholder='Search' name="" id="" />
  )
}



