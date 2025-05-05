import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TEMPLATE_STATUS, SUBMIT_TEMPLATE } from "../../pages/Mutation/Template";

const TemplateForm = ({ setTriggerRefetch } : any) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'UTILITY',
        language: 'en_US',
        headerText: '',
        bodyText: '',
        footerText: '',
        buttonText: '',
        buttonUrl: '',
        body_text : ''
      });
      const [status, setStatus] = useState(null);
      const [templateId, setTemplateId] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [error, setError] = useState(null);
      const [submitTemplate] = useMutation(SUBMIT_TEMPLATE);

    
      const handleInputChange = (e : any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e : any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setStatus(null);
    
        try {
          const variables = {
            template: {
              name: formData.name.toLowerCase().replace(/\s/g, '_'),
              category: formData.category,
              language: formData.language,
              components: [
                formData.headerText && {
                  type: 'HEADER',
                  format: 'TEXT',
                  text: formData.headerText
                },
                {
                  type: 'BODY',
                  text: formData.bodyText,
                  example: {
                    body_text: [[formData.body_text]]
                  }
                },
                formData.footerText && {
                  type: 'FOOTER',
                  text: formData.footerText
                },
                formData.buttonText && formData.buttonUrl && {
                  type: 'BUTTONS',
                  buttons: [{ type: 'URL', text: formData.buttonText, url : formData.buttonUrl }]
                  // buttons: [{ type: 'QUICK_REPLY', text: formData.buttonText }]
                }
              ].filter(Boolean)
            }
          };
          const response = await submitTemplate({ variables });
          const result = response.data.submitTemplate;
          setStatus(result);
          if (result.success) {
            setTemplateId(JSON.parse(result.data).id);
            checkStatus(JSON.parse(result.data).id, setStatus, setError)
            setTriggerRefetch((prevCount : any) => prevCount + 1)
          }
        } catch (err : any) {
          setError(err.message || 'Failed to submit template');
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

      const checkStatus = (templateId : any, setStatus : any, setError : any) => {
        if (!templateId) return;
    
        const { data, error } = useQuery(GET_TEMPLATE_STATUS  , {
          variables: { templateId },
          skip: !templateId,
          onCompleted: (data) => {
            setStatus(data.getTemplateStatus);
            setTriggerRefetch((prevCount : any) => prevCount + 1)
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
      <div className="max-w-2xl mx-auto p-6">
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
                  value={formData.name}
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
                  value={formData.category}
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
                  value={formData.language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                  placeholder="en_US"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 ">Header Text (Optional)</label>
                <input
                  type="text"
                  name="headerText"
                  value={formData.headerText}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                  placeholder="Welcome to Our Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Body Text</label>
                <textarea
                  name="bodyText"
                  value={formData.bodyText}
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
                  value={formData.body_text}
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
                  value={formData.footerText}
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
                  value={formData.buttonText}
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
                  value={formData.buttonUrl}
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
                onClick={() => checkStatus(templateId,setStatus, setError )}
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