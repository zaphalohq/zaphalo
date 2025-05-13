import { useContext, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TEMPLATE_STATUS, SUBMIT_TEMPLATE } from "../../pages/Mutation/Template";
import { TemplateContext } from "../Context/TemplateContext";
import TemplateFileUpload from "./TemplateFileUpload";
import axios from 'axios';
import { getItem } from "../utils/localStorage";

const TemplateForm = ({ setTriggerRefetch }: any) => {
  const [templateData, setTemplateData] = useState({
    name: '',
    category: 'UTILITY',
    language: 'en_US',
    headerText: '',
    bodyText: '',
    footerText: '',
    buttonText: '',
    buttonUrl: '',
    body_text: '',
    headerFormat: 'TEXT',
    header_handle: '',
    imageUrl: ''
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
    console.log(imageURL,"iamdsnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    
    setTemplateFormData({ ...templateFormData, ["imageURL"]: imageURL})
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    const updatedTemplateData = await handleFileUpload()
    try {
      const response = await submitTemplate({ variables: { templateData : updatedTemplateData } });
      const result = response.data;
      console.log(response.data);
      
      setStatus(result);
      if (result.success) {
        setTemplateId(JSON.parse(result.data).id);
        checkStatus(JSON.parse(result.data).id)
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

  const checkStatus = (templateId: any) => {
    if (!templateId) return;

    const { data, error } = useQuery(GET_TEMPLATE_STATUS, {
      variables: { templateId },
      skip: !templateId,
      onCompleted: (data) => {
        setStatus(data.getTemplateStatus);
        setTriggerRefetch((prevCount: any) => prevCount + 1)
      },
      onError: (err) => {
        setError(err.message || 'Failed to check status');
      },
    });

    if (data) {
      setStatus(data.getTemplateStatus);
    }
    if (error) {
      setError(error.message || 'Failed to check status');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">WhatsApp Template Manager</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Submit New Template</h2>
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Template Name</label>
              <input
                type="text"
                name="name"
                value={templateData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md outline-none shadow-sm p-2"
                placeholder="welcome_message"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={templateData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              >
                <option value="UTILITY">Utility</option>
                <option value="MARKETING">Marketing</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <input
                type="text"
                name="language"
                value={templateData.language}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="en_US"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Header</label>
              <select
                name="headerFormat"
                value={templateData.headerFormat}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              >
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>

            {templateData.headerFormat === 'TEXT' ?
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Header Text (Optional)</label>
                <input
                  type="text"
                  name="headerText"
                  value={templateData.headerText}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                  placeholder="Welcome to Our Service"
                />
              </div>
              :
              <></>
            }

            {templateData.headerFormat === 'IMAGE' ?
              <>
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Upload Image to WhatsApp</h2>
                <input
                  type="file"
                  name="imageUrl"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                /></>
              :
              <></>
            }

            <div>
              <label className="block text-sm font-medium text-gray-700">Body Text</label>
              <textarea
                name="bodyText"
                value={templateData.bodyText}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Hello {{1}}, thank you for joining!"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Body Example Text (Optional)</label>
              <input
                type="text"
                name="body_text"
                value={templateData.body_text}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Chintan Patel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Text (Optional)</label>
              <input
                type="text"
                name="footerText"
                value={templateData.footerText}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Contact us for support"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Button Text (Optional)</label>
              <input
                type="text"
                name="buttonText"
                value={templateData.buttonText}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Learn More"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Button URL (Optional)</label>
              <input
                type="text"
                name="buttonUrl"
                value={templateData.buttonUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="https://chatgpt.com/"
              />
            </div>

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
              onClick={() => checkStatus(templateId)}
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