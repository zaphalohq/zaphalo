import React from 'react'

const SubmitButton = ({ title, type, onClick, Icon } : {
  title: string;
  type?: 'button' | 'submit' | 'reset' | undefined; // Optional 'type' prop, defaulting to 'button'
  onClick?: () => void; // Optional onClick handler
  Icon?: React.ComponentType<any>; // Optional icon component
}) => {
  return (
    <div>
      <button type={type} onClick={onClick} className='w-full cursor-pointer bg-violet-500 hover:bg-violet-600 text-white rounded p-2 px-8 flex items-center justify-center gap-4' >
        <div  >{Icon ? <Icon /> : null }</div>
        <div>{title}</div>
      </button>
    </div>
  )
}

export const CloseButton = ({ title, type, onClick, Icon } : {
  title: string;
  type?: 'button' | 'submit' | 'reset' | undefined; // Optional 'type' prop, defaulting to 'button'
  onClick?: () => void; // Optional onClick handler
  Icon?: React.ComponentType<any>; // Optional icon component
}) => {
  return (
    <div>
      <button type={type} onClick={onClick} className='w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded p-2 px-8 flex items-center justify-center gap-4' >
        <div  className='text-xl'>{Icon ? <Icon /> : null }</div>
        <div>{title}</div>
      </button>
    </div>
  )
}

export default SubmitButton

export const DeleteButton = ({ title, onClick, Icon } : any) => {
  return (
    <div>
      <button onClick={onClick} className='w-full cursor-pointer bg-[#ED4337] hover:bg-red-600 text-white rounded p-2 px-8 flex items-center justify-center gap-4' >
        <div className='text-lg' >{Icon ? <Icon /> : null }</div>
        <div>{title}</div>
      </button>
    </div>
  )
}
