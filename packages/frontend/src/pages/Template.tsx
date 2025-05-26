import { FaPlus } from 'react-icons/fa'
import TemplateForm from '@components/Template/TemplateForm'
import SubmitButton, { CloseButton } from '@components/UI/SubmitButton'
import { useContext, useState } from 'react'
import { FiArrowLeft, FiX } from 'react-icons/fi'
import TemplateTable from '@components/Template/TemplateTable'
import { TemplateContext, TemplateProvider } from '@components/Context/TemplateContext'
import TemplatePreview from '@components/Template/TemplatePreview'

const TemplateMain = () => {
  const [isTemplateFormVis, setIsTemplateFormVis] = useState(false)
  const [triggerRefetch, setTriggerRefetch] = useState(0)
  const [isTemplatePreviewVis, setIsTemplatePreviewVis] = useState(false)
  const { templateFormData,setTemplateFormData }: any = useContext(TemplateContext)
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
          <div className=' absolute right-35 top-60 flex justify-center items-center'>
            <TemplatePreview templatePreviewData={templateFormData} />
          </div>
        </div>
        : <></>}
      <div>
        {!isTemplateFormVis ?
          (isTemplatePreviewVis ? (
            <div>
              <div onClick={() => {
                setTemplateFormData({
                  account: '',
                  templateName: '',
                  category: 'UTILITY',
                  language: 'en_US',
                  bodyText: '',
                  footerText: '',
                  headerType: 'NONE',
                  header_handle: '',
                  button: [],
                  variables: [],
                })
                setIsTemplatePreviewVis(false)
              }} className='ml-6 flex items-center justify-center h-10 w-10 rounded-full bg-violet-400 hover:bg-violet-500 cursor-pointer text-white text-lg font-bold'><FiArrowLeft /></div>
              <TemplatePreview templatePreviewData={templateFormData} />
            </div>)
            : <TemplateTable triggerRefetch={triggerRefetch} setIsTemplatePreviewVis={setIsTemplatePreviewVis} />)
          : <></>}
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
