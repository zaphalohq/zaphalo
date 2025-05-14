import { FaPlus } from 'react-icons/fa'
import TemplateForm from '@components/Template/TemplateForm'
import SubmitButton, { CloseButton } from '@components/UI/SubmitButton'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import TemplateTable from '@components/Template/TemplateTable'
import { TemplateProvider } from '@components/Context/TemplateContext'
import TemplatePreview from '@components/Template/TemplatePreview'

const TemplateMain = () => {
  const [isTemplateFormVis, setIsTemplateFormVis] = useState(false)
  const [triggerRefetch, setTriggerRefetch] = useState(0)

  return (
    <div className='h-[calc(100vh-90px)] overflow-y-scroll'>
      <div className="grid grid-cols-4 pt-4 px-4 ">
        <div className="md:col-start-4 md:pb-0 col-start-1 col-end-4 pb-4">
          {!isTemplateFormVis ? <SubmitButton type='button' onClick={() => setIsTemplateFormVis(true)} title="Create New Template" Icon={FaPlus} />
            : <CloseButton type='button' onClick={() => setIsTemplateFormVis(false)} title="Close Create Template" Icon={FiX} />}
        </div>
      </div>
      {isTemplateFormVis ?
        <div className="grid grid-cols-2 gap-6 p-6 overflow-y-auto ">
          <TemplateForm setTriggerRefetch={setTriggerRefetch} />
          <div className=' absolute right-60 top-96 flex justify-center items-center'>

            {/* <div>{templateFormData.name}</div>
                <div>{templateFormData.category}</div>
                <div>{templateFormData.language}</div>
                <div>{templateFormData.headerText}</div>
                <div>{templateFormData.footerText}</div>
                <div>{templateFormData.buttonText}</div>
                <div>{templateFormData.buttonUrl}</div>
                <div>{templateFormData.body_text}</div>
                <div>{templateFormData.headerFormat}</div> */}
            <TemplatePreview />
          </div>
        </div>
        : <></>}
      <div>
        {!isTemplateFormVis ? <TemplateTable triggerRefetch={triggerRefetch} /> : <></>}
      </div>
    </div>
  )
}

const Template = () => {
  return (
    <TemplateProvider>
      <TemplateMain />
    </TemplateProvider>
  );
};

export default Template
