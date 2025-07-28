import React from 'react'
import CloseButton from './CloseButton'
import InputLabel from './InputLabel'
import SubmitButton from './SubmitButton'

const SaveContact = ({ HandleSaveContactVis, 
                       HandleSubmitContact, 
                       HandleChangeData, 
                       contactData } : any) => {
  return (
            <div className='fixed inset-0 h-screen w-screen top-0 left-0 right-0 bottom-0 z-11 bg-stone-900/30'>
            <div className='bg-white  m-[10%] mx-[30%] p-6 pb-12 rounded-lg'>
                <CloseButton onClick={HandleSaveContactVis} top="top-30" right="right-100" />
                <div className='text-2xl font-semibold p-4 text-center'>Edit Contact</div>
                <div className='px-6'>
                    <form onSubmit={HandleSubmitContact}>
                        <InputLabel value={contactData.contactName} type="text" HandleInputChange={HandleChangeData} name="contactName" title="Contact name" placeholder="Enter contact name" />
                        <InputLabel value={contactData.contactNo} type="number" HandleInputChange={HandleChangeData} name="contactNo" title="Contact number" placeholder="Enter contact number" />
                        {/* {fileError && <p className="text-red-500">{fileError}</p>} */}
                        <div className='mt-4 h-full'>
                            <SubmitButton title='Save contact' type='submit' />
                        </div>
                    </form>
                </div>

            </div>
        </div>
  )
}

export default SaveContact
