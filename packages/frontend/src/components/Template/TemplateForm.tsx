import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import TemplateBasic from "./TemplateBasic";
import TemplateBody from "./TemplateBody";
import TemplateButton from "./TemplateButton";
import TemplateVariables from "./TemplateVariables";
import { useMutation } from "@apollo/client";
import { cookieStorage } from '@src/utils/cookie-storage';
import { SUBMIT_TEMPLATE } from "@src/generated/graphql";
import { TemplateContext } from "@components/Context/TemplateContext";
import { Post } from "@src/modules/domain-manager/hooks/axios";

type WaButtonInput = {
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
};

type WaVariableInput = {
  name: string;
  value: string;
};

type TemplateData = {
  account: string;
  templateName: string;
  category: 'UTILITY' | 'MARKETING' | 'TRANSACTIONAL' | string;
  language: string;
  bodyText: string;
  footerText: string;
  button: WaButtonInput[];
  variables: WaVariableInput[];
  headerType: 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  header_handle: string;
  fileUrl: string;
};

const TemplateForm = () => {
  const [templateData, setTemplateData] = useState<TemplateData>({
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
    variables: [],
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
  const [isValidated, setIsValidated] = useState(false)
  const handleInputChange = (e: any) => {
    setTemplateData({ ...templateData, [e.target.name]: e.target.value });
    setTemplateFormData({ ...templateFormData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log(templateData.variables, templateData.button, templateData.button.length, '................');

    if (templateData.account !== '' && templateData.templateName !== '' && templateData.category !== '' && templateData.language !== '' && templateData.bodyText !== '') {
      const variableMatches = templateFormData.bodyText.match(/{{\d+}}/g) || [];
      if (variableMatches.length === templateData.variables.length) {
        setIsValidated(true);
      } else {
        setIsValidated(false);
      }
    }
  }, [templateData])

  const handleFileUpload = async () => {
    let updatedTemplateData = { ...templateData };
    const accessToken = cookieStorage.getItem('accessToken')
    if (file !== null) {


      try {
        //   const response = await Post(`/templateFileUpload`, formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     },
        //   });
        const formData = new FormData();
        formData.append('file', file);
        const response = await Post(
          `/fileupload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        updatedTemplateData['header_handle'] = response.data;
        updatedTemplateData['fileUrl'] = response.data.fileUrl;
        setTemplateData(updatedTemplateData);
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
    try {
      const response = await submitTemplate({ variables: { templateData: updatedTemplateData } });
      const result = response.data;
      setStatus(result);
      if (result.success) {
        setTemplateId(JSON.parse(result.data).id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit template');
      console.error(err);

    } finally {
      setIsSubmitting(false);
    }
  };

  const [currentComponent, setCurrentComponent] = useState("Body")
  const templateComponents = ["Body", "Buttons", "Variables"]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">WhatsApp Template Manager</h1>
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Submit New Template</h2>
          <TemplateBasic templateData={templateData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />
          <div className="flex mb-6 mt-4">
            {templateComponents.map((component, index) =>
              <button type="button" key={index} onClick={() => setCurrentComponent(component)}
                className={`${currentComponent === component ? 'border-l-1 border-r-1 border-t-1 border-gray-400 rounded-t' : 'border-b-1 border-gray-400'} cursor-pointer text-center px-2`}>
                {component}
              </button>)}
            <div className="flex-1 border-b border-gray-400"></div>
          </div>

          <div>
            <div className="space-y-4">
              {currentComponent === "Body" ?
                <TemplateBody templateData={templateFormData} handleInputChange={handleInputChange} />
                : <></>}
              {currentComponent === "Buttons" ?
                <TemplateButton templateData={templateFormData} setTemplateData={setTemplateData} />
                : <></>}

              {currentComponent === "Variables" ?
                <TemplateVariables setTemplateData={setTemplateData} />
                : <></>}
              <button
                type="submit"
                disabled={isSubmitting || !isValidated}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 p-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Template'}
              </button>
            </div>
          </div>
        </div>
      </form>
      {status && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Template Status</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
          {templateId && (
            <button type="button"
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