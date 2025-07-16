import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import TemplateBasic from "./TemplateBasic";
import TemplateBody from "./TemplateBody";
import TemplateButton from "./TemplateButton";
import TemplateVariables from "./TemplateVariables";
import { useMutation } from "@apollo/client";
import { cookieStorage } from '@src/utils/cookie-storage';
import { CreateOneAttachmentDoc, SAVE_TEMPLATE, SUBMIT_TEMPLATE, UPDATE_TEMPLATE } from "@src/generated/graphql";
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
  accountId: string;
  templateName: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION' | string;
  language: string;
  bodyText: string;
  footerText: string;
  button: WaButtonInput[];
  headerText: string;
  variables: WaVariableInput[];
  headerType: 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  header_handle: string;
  fileUrl: string;
  attachmentId: string | null;
};

const TemplateForm = () => {
  const { templateFormData, setTemplateFormData, selectedTemplateInfo }: any = useContext(TemplateContext)
  const [templateData, setTemplateData] = useState<TemplateData>(() => ({ ...templateFormData }));
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [submitTemplate] = useMutation(SUBMIT_TEMPLATE);
  const [saveTemplate] = useMutation(SAVE_TEMPLATE);
  const [updateTemplate] = useMutation(UPDATE_TEMPLATE);
  const [createOneAttachment] = useMutation(CreateOneAttachmentDoc);



  const [file, setFile] = useState<File | null>(null);
  const [isValidated, setIsValidated] = useState(false)
  const handleInputChange = (e: any) => {
    setTemplateData({ ...templateData, [e.target.name]: e.target.value });
    setTemplateFormData({ ...templateFormData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const validateTemplate = () => {
      const { headerType, headerText, variables } = templateData;
      const variableMatches = templateData.bodyText.match(/{{\d+}}/g) || [];

      if (headerType === "TEXT" && !headerText?.trim()) {
        return false;
      }

      if (
        ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType) &&
        !file
      ) {
        return false;
      }

      if (variableMatches.length !== variables.length) {
        return false;
      }

      for (let i = 0; i < variables.length; i++) {
        if (!variables[i].value || variables[i].value.trim() === "") {
          return false;
        }
      }
      return true;
    }

    if (validateTemplate()) {
      setIsValidated(true)
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
          `/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // updatedTemplateData['header_handle'] = response.data;
        // updatedTemplateData['fileUrl'] = response.data.file.filename;
        if (response.data) {
          const attachment: any = await createOneAttachment({
            variables: {
              name: response.data.file.filename,
              originalname: response.data.file.originalname,
              mimetype: response.data.file.mimetype,
              size: response.data.file.size,
              path: response.data.file.path,
              createdAt: "",
              updatedAt: "",
            }
          })
          updatedTemplateData['attachmentId'] = attachment.data.CreateOneAttachment.id;
        }
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

    if (!validateTemplate()) {
      setIsSubmitting(false);
      return;
    }


    const updatedTemplateData = await handleFileUpload()
    try {
      const response = await submitTemplate({ variables: { templateData: updatedTemplateData, dbTemplateId: selectedTemplateInfo.dbTemplateId } });
      const result = response.data;
      setStatus(result);
    } catch (err: any) {
      setError(err.message || 'Failed to submit template');
      console.error(err);

    } finally {
      setIsSubmitting(false);
    }
  };

  const [currentComponent, setCurrentComponent] = useState("Body")
  const templateComponents = ["Body", "Buttons", "Variables"]


  const handleSaveTemplate = async (e: any) => {
    if (!templateData.templateName) {
      setError('Template name is required to save.');
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    const updatedTemplateData = await handleFileUpload()

    try {
      const response = await saveTemplate({ variables: { templateData: updatedTemplateData } });
      const result = response.data;
      setStatus(result);
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
      console.error(err);

    } finally {
      setIsSubmitting(false);
    }
  }


  const handleUpdateTemplate = async (e: any) => {
    if (!templateData.templateName) {
      setError('Template name is required to save.');
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    const updatedTemplateData = await handleFileUpload()
    try {
      const response = await updateTemplate({ variables: { templateData: updatedTemplateData, dbTemplateId: selectedTemplateInfo.dbTemplateId } });
      const result = response.data;
      setStatus(result);
    } catch (err: any) {
      setError(err.message || 'Failed to update template');
      console.error(err);

    } finally {
      setIsSubmitting(false);
    }
  }


  const validateTemplate = () => {
    const { headerType, headerText, variables } = templateData;
    const variableMatches = templateData.bodyText.match(/{{\d+}}/g) || [];

    if (headerType === "TEXT" && !headerText?.trim()) {
      setError("Header text is required when header type is TEXT.");
      return false;
    }

    if (
      ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType) &&
      !file
    ) {
      setError(`File upload is required when header type is ${headerType}.`);
      return false;
    }

    if (variableMatches.length !== variables.length) {
      setError(`Expected ${variableMatches.length} variables but found ${variables.length}.`);
      return false;
    }

    for (let i = 0; i < variables.length; i++) {
      if (!variables[i].value || variables[i].value.trim() === "") {
        setError(`Value for variable ${variables[i].name} is required.`);
        return false;
      }
    }

    return true;
  };


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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  disabled={selectedTemplateInfo.status !== ''}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 p-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Template'}
                </button>
                <button
                  type="button"
                  onClick={handleUpdateTemplate}
                  disabled={
                    selectedTemplateInfo.status !== 'pending' &&
                    selectedTemplateInfo.status !== 'saved' &&
                    selectedTemplateInfo.status !== 'approved' &&
                    selectedTemplateInfo.status !== 'rejected'}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 p-2"
                >
                  {isSubmitting ? 'Editing...' : 'Edit Template'}
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !isValidated ||
                    (selectedTemplateInfo.status !== 'saved' && selectedTemplateInfo.status !== '')}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 p-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Template'}
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !isValidated ||
                    !(selectedTemplateInfo.status === 'approved' || selectedTemplateInfo.status === 'rejected')
                  }
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 p-2"
                >
                  {isSubmitting ? 'Updating...' : 'Update & Submit Template'}
                </button>
              </div>

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
          {/* {templateId && (
            <button type="button"
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Refresh Status
            </button>
          )} */}
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