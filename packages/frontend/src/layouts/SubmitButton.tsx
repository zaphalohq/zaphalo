import React from 'react'

const SubmitButton = ({ title, HandleClick } : any) => {
  return (
    <div>
      <button onClick={HandleClick} className='w-full bg-violet-500 hover:bg-violet-600 text-white rounded p-2' >
        {title}
      </button>
    </div>
  )
}

export default SubmitButton
