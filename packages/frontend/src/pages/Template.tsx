import { FaPlus } from 'react-icons/fa'
import TemplateForm from '../components/Template/TemplateForm'
import SubmitButton, { CloseButton } from '../components/UI/SubmitButton'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import TemplateTable from '../components/Template/TemplateTable'

const Template = () => {
  const [isTemplateFormVis, setIsTemplateFormVis] = useState(false)
  const [triggerRefetch, setTriggerRefetch ] = useState(0)
  return (
    <div className='h-[calc(100vh-90px)] overflow-y-scroll'>
      <div className="grid grid-cols-4 pt-4 px-4 ">
        <div className="md:col-start-4 md:pb-0 col-start-1 col-end-4 pb-4">
          {!isTemplateFormVis ? <SubmitButton type='button' onClick={() => setIsTemplateFormVis(true)} title="Create New Template" Icon={FaPlus} />
            : <CloseButton type='button' onClick={() => setIsTemplateFormVis(false)} title="Close Create Template" Icon={FiX} />}
        </div>
      </div>
      {isTemplateFormVis ? <TemplateForm setTriggerRefetch={setTriggerRefetch} /> : <></>}
      <div>
        <TemplateTable triggerRefetch={triggerRefetch} />
      </div>
    </div>
  )
}

export default Template
