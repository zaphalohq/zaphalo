import { useContext, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TEMPLATE_STATUS, SUBMIT_TEMPLATE } from "@pages/Mutation/Template";
import { TemplateContext } from "@Context/TemplateContext";
import axios from 'axios';
import { getItem } from "@utils/localStorage";
import TemplateBasic from "./TemplateBasic";
import TemplateBody from "./TemplateBody";
import TemplateButton from "./TemplateButton";
import TemplateVariables from "./TemplateVariables";

const TemplateForm = ({ setTriggerRefetch }: any) => {
  const [templateData, setTemplateData] = useState({
    account: '',
    templateName: '',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: `Hi {{1}},
Your order *{{2}}* from *{{3}}* has been shipped.
To track the shipping: {{4}}
Thank you.`,
    footerText: '',
    button: [],
    variables : [],
    headerType: 'NONE',
    header_handle: '',
    fileUrl: ''
  });
  const [status, setStatus] = useState(null);
  const [templateId, setTemplateId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [submitTemplate] = useMutation(SUBMIT_TEMPLATE);
  const { templateFormData, setTemplateFormData }: any = useContext(TemplateContext)
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: any) => {
    setTemplateData({ ...templateData, [e.target.name]: e.target.value });
    setTemplateFormData({ ...templateFormData, [e.target.name]: e.target.value });
    console.log(templateData);

  };

  const handleFileUpload = async () => {
    let updatedTemplateData = { ...templateData };
    if (file !== null) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/templateFileUpload`, formData, {
          headers: {
            Authorization: `Bearer ${getItem('access_token')}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        updatedTemplateData['header_handle'] = response.data.file_handle;
        updatedTemplateData['fileUrl'] = response.data.fileUrl;
        setTemplateData(updatedTemplateData);
        console.log('File uploaded successfully:', response.data);
        return updatedTemplateData
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return updatedTemplateData

  }


  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file)
      const imageURL = URL.createObjectURL(file)
      setTemplateFormData({ ...templateFormData, ["fileUrl"]: imageURL })
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    const updatedTemplateData = await handleFileUpload()
    console.log(templateData);
    
    try {
      const response = await submitTemplate({ variables: { templateData: updatedTemplateData } });
      const result = response.data;
      console.log(response.data);

      setStatus(result);
      if (result.success) {
        setTemplateId(JSON.parse(result.data).id);
        // checkStatus(JSON.parse(result.data).id)
        setTriggerRefetch((prevCount: any) => prevCount + 1)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit template');
      console.log(err);

    } finally {
      setIsSubmitting(false);
    }
  };

  // const [getTemplateStatus] = useMutation\(GET_TEMPLATE_STATUS);
  // const checkStatus = async () => {
  //     if (!templateId) return;
  //     try {
  //       const response = await getTemplateStatus({ variables: { templateId } });
  //       setStatus(response.data.getTemplateStatus);
  //     } catch (err : any) {
  //       setError(err.message || 'Failed to check status');
  //     }
  //   };

  // const checkStatus = (templateId: any) => {
  //   if (!templateId) return;

  //   const { data, error } = useQuery(GET_TEMPLATE_STATUS, {
  //     variables: { templateId },
  //     skip: !templateId,
  //     onCompleted: (data) => {
  //       setStatus(data.getTemplateStatus);
  //       setTriggerRefetch((prevCount: any) => prevCount + 1)
  //     },
  //     onError: (err) => {
  //       setError(err.message || 'Failed to check status');
  //     },
  //   });

  //   if (data) {
  //     setStatus(data.getTemplateStatus);
  //   }
  //   if (error) {
  //     setError(error.message || 'Failed to check status');
  //   }
  // };

  const [currentComponent, setCurrentComponent] = useState("Body")
  const templateComponents = ["Body", "Buttons", "Variables"]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">WhatsApp Template Manager</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Submit New Template</h2>
        <TemplateBasic templateData={templateData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />
        <div className="flex mb-6 mt-4">
          {templateComponents.map((component, index) =>
            <button key={index} onClick={() => setCurrentComponent(component)}
              className={`${currentComponent === component ? 'border-l-1 border-r-1 border-t-1 border-gray-400 rounded-t' : 'border-b-1 border-gray-400'} cursor-pointer text-center px-2`}>
              {component}
            </button>)}
          <div className="flex-1 border-b border-gray-400"></div>
        </div>

        <div>
          <div className="space-y-4">
            {currentComponent == "Body" ?
              <TemplateBody templateData={templateData} handleInputChange={handleInputChange} />
              : <></>}
            {currentComponent == "Buttons" ?
              <TemplateButton templateData={templateData} setTemplateData={setTemplateData} />
              : <></>}

            {currentComponent == "Variables" ?
              <TemplateVariables setTemplateData={setTemplateData} />
              : <></>}
            {/* <div className="grid grid-cols-2 gap-6 mt-8">
            <div onClick={() =>{
              const componentIndex = templateComponents.findIndex((component : any ) => component == currentComponent)
              if(componentIndex == 0){
                setCurrentComponent(templateComponents[0])
              }else{
              setCurrentComponent(templateComponents[componentIndex - 1])
              }
            }} className="p-2 flex items-center justify-center gap-2 rounded text-lg text-white cursor-pointer bg-violet-500 hover:bg-violet-700">
              <FiChevronLeft />
              <p>Previous</p>
            </div>
            <div onClick={() =>{
              const componentIndex = templateComponents.findIndex((component : any ) => component == currentComponent)
              if(componentIndex == 4){
                setCurrentComponent(templateComponents[4])
              }else{
              setCurrentComponent(templateComponents[componentIndex + 1])
              }
            }} className="p-2 flex items-center justify-center gap-2 rounded text-lg text-white cursor-pointer bg-violet-500 hover:bg-violet-700">
              <p>Next</p>
              <FiChevronRight />
            </div>
           </div> */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 p-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Template'}
            </button>
          </div>
        </div>
      </div>

      {status && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Template Status</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
          {templateId && (
            <button
              // onClick={() => checkStatus(templateId)}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Refresh Status
            </button>
          )}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4" role="alert">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};


export default TemplateForm