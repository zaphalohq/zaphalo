
const SideMain = ({ title, lastmsg } : any) => {
  return (
    <div>
      {/* this is the main */}
      <div onClick={() => console.log("...........")} className='flex items-center justify-between px-6 py-3 hover:bg-stone-100 border-b border-stone-300'>
            <div className='flex gap-4'>          
              {/* Profile Picture */}
              <img className='w-11 h-11 object-cover rounded-full' src="https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/L73IDX7GKCHAD7EJJS7FQ7A6BU.JPG&w=1200" alt="" />
              {/* Message Details */}
              <div>
                <p className='font-bold truncate w-[9rem]'>{title}</p>
                <div className='truncate w-[9.375rem]'>{lastmsg}</div>
              </div>
            </div>
            {/* Message Time and Notification */}
            <span className='flex flex-col items-end text-sm'>
              <div>12:00</div>
              <div className='flex items-center w-5 h-5 text-xs justify-center bg-green-500 rounded-full text-white'>2</div>
            </span>
          </div>
    </div>
  )
}

export default SideMain
