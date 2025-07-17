import { FaPlus } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import TemplateForm from '@components/Template/TemplateForm';
import TemplateTable from '@components/Template/TemplateTable';
import TemplatePreview from '@components/Template/TemplatePreview';
import SubmitButton, { CloseButton } from '@components/UI/SubmitButton';
import { TemplateContext, TemplateProvider } from '@components/Context/TemplateContext';

const TemplateMain = () => {
  const [isTemplateFormVis, setIsTemplateFormVis] = useState(false)
  const [isTemplatePreviewVis, setIsTemplatePreviewVis] = useState(false)
  const { templateFormData, setTemplateFormData, setSelectedTemplateInfo, selectedTemplateInfo }: any = useContext(TemplateContext)
  return (
    <div >
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Mailing List</div>
      <div className='h-[calc(100vh-100px)]  overflow-y-scroll'>
        <div className="grid grid-cols-4 pt-4 px-4 ">
          <div className="md:col-start-4 md:pb-0 col-start-1 col-end-4 pb-4">
            {!isTemplateFormVis ?
              <SubmitButton type='button' onClick={() => {
                setTemplateFormData({
                  accountId: '',
                  templateName: '',
                  category: 'UTILITY',
                  language: 'en_US',
                  bodyText: `Hi {{1}},
Your order *{{2}}* from *{{3}}* has been shipped.
To track the shipping: {{4}}
Thank you.`,
                  footerText: '',
                  headerType: 'NONE',
                  header_handle: '',
                  button: [],
                  variables: [],
                  fileUrl: '',
                  attachmentId: null
                })
                setSelectedTemplateInfo({
                  dbTemplateId: '',
                  status: ''
                })
                setIsTemplateFormVis(true)
              }} title="Create New Template" Icon={FaPlus} />
              : <CloseButton type='button' onClick={() => setIsTemplateFormVis(false)} title="Close Create Template" Icon={FiX} />}
          </div>
        </div>
        {isTemplateFormVis ?
          <div className="grid grid-cols-2 gap-6 p-6 overflow-y-auto ">
            <TemplateForm />
            <div className=' absolute right-35 top-60 flex justify-center items-center'>
              <TemplatePreview templatePreviewData={templateFormData} selectedTemplateInfo={selectedTemplateInfo} />
            </div>
          </div>
          : <></>}
        <div>
          {!isTemplateFormVis ?
            (isTemplatePreviewVis ? (
              <div>
                <div onClick={() => {
                  setTemplateFormData({
                    accountId: '',
                    templateName: '',
                    category: 'UTILITY',
                    language: 'en_US',
                    bodyText: '',
                    footerText: '',
                    headerType: 'NONE',
                    header_handle: '',
                    button: [],
                    variables: [],
                    attachmentId: null
                  })
                  setSelectedTemplateInfo({
                    dbTemplateId: '',
                    status: ''
                  })
                  setIsTemplatePreviewVis(false)
                }} className='ml-6 flex items-center justify-center h-10 w-10 rounded-full bg-violet-400 hover:bg-violet-500 cursor-pointer text-white text-lg font-bold'><FiArrowLeft /></div>
                <TemplatePreview templatePreviewData={templateFormData} selectedTemplateInfo={selectedTemplateInfo} />
              </div>)
              : <TemplateTable setIsTemplateFormVis={setIsTemplateFormVis} setIsTemplatePreviewVis={setIsTemplatePreviewVis} />)
            : <></>}
        </div>
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
