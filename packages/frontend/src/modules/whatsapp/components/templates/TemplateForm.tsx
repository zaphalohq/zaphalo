import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { Input } from "@src/components/UI/input";
import { Textarea } from "@src/components/UI/textarea";
import { Button } from "@src/components/UI/button";
import { Card, CardContent } from "@src/components/UI/card";
import SelectField from "@src/components/UI/ApiDropdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";
import {
  ReadWaAccount,
  SaveWhatsappTemplate,
  GetTemplate,
  CreateOneAttachmentDoc,
  SubmitWhatsappTemplate,
  useUploadFileMutation,
  FileFolder
} from "@src/generated/graphql";
import { toast } from 'react-toastify';
import { isDefined } from '@src/utils/validation/isDefined';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Label } from "@components/UI/label";
import { Languages } from "@src/modules/whatsapp/language-code";
import TemplateButton from "@src/modules/whatsapp/components/templates/TemplateButton";
import TemplateVariables from "@src/modules/whatsapp/components/templates/TemplateVariables";
import { TemplateContext } from '@src/modules/whatsapp/Context/TemplateContext';
import { Post } from "@src/modules/domain-manager/hooks/axios";
import TemplatePreviewDialog from '@src/modules/whatsapp/components/templates/TemplatePreview';
import { getImageAbsoluteURI } from "@src/utils/getImageAbsoluteURI"
import { isNonEmptyString } from '@sniptt/guards';
import { VITE_BACKEND_URL } from '@src/config';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@components/UI/tabs"

import {
  AlertTriangle,
  ChevronDown,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react"
import { useApolloCoreClient } from "@src/modules/apollo/hooks/useApolloCoreClient";

export default function TemplateForm({ onBack, recordId, readOnly = false }) {
  const [active, setActive] = useState("overview");
  const [preview, setPreview] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const { templateData, setTemplateData, attachment, setAttachment }: any = useContext(TemplateContext)
  const [file, setFile] = useState<File | null>(null);
  const coreClient = useApolloCoreClient();

  if (isDefined(recordId)){
    const { data: templateViewData, loading: viewLoading, error: viewError } = useQuery(GetTemplate, {
      variables: {
        templateId: recordId
      },
      fetchPolicy: "cache-and-network",
    })
    const templateView = templateViewData?.getTemplate?.template;

    if (templateView && templateData.templateId !== recordId){
      setTemplateData({
        templateId: templateView.id,
        templateName: templateView.templateName,
        whatsappAccountId: templateView.account.id,
        category: templateView.category,
        headerType: templateView.headerType,
        headerText: templateView.headerText,
        language: templateView.language,
        bodyText: templateView.bodyText,
        footerText: templateView.footerText,
        buttons: templateView.buttons ? templateView.buttons.map(({ type, phone_number, text, url }) => ({ type, phone_number, text, url })) : [],
        variables: templateView.variables ? templateView.variables.map(({ name, type, value, dynamicField, sampleValue }) => ({ name, type, value, dynamicField, sampleValue })) : [],
        attachmentId: templateView?.attachment?.id || null,
        templateImg: templateView.templateImg,
      })
      if(templateView?.attachment){
        setAttachment({
          attachmentId: templateView.attachment.id,
          originalname: templateView.attachment.originalname,
          name: templateView.attachment.name,
        })
      }
      if (templateData.state != 'new'){
        readOnly = false
      }
    }
  }

  const [saveTemplate, { data, loading, error }] = useMutation(SaveWhatsappTemplate, {
    onCompleted: (data) => {
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });

  const [submitTemplate, { data: submitData, loading: submitLoading, error: submitError }] = useMutation(SubmitWhatsappTemplate, {
    onCompleted: (data) => {
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });

  const [uploadFile] = useUploadFileMutation({ client: coreClient });
  const [createOneAttachment] = useMutation(CreateOneAttachmentDoc);

  useEffect(() => {
    const validateTemplate = () => {
      const { headerType, headerText, variables } = templateData;
      const variableMatches = templateData?.bodyText?.match(/{{\d+}}/g) || [];

      if (headerType === "TEXT" && !headerText?.trim()) {
        return false;
      }

      if (
        ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType) &&
        (!file && !attachment.originalname?.trim())
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
    if (!file)
      return false

    try {
      const response = await uploadFile({
        variables: {
          file,
          fileFolder: FileFolder.Attachment,
        },
      });

      const signedFile = response?.data?.uploadFile;
      const { path: attachmentPath } = signedFile;
      
      if (response.data) {
        const attachment = await createOneAttachment({
          variables: {
            name: file.name,
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
            path: attachmentPath,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        })

        const attachmentRec = attachment.data.CreateOneAttachment;
        return attachmentRec
      }else{

      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return false
    }
  }

  const checkValidation = (templateData: any) => {
    // let formValid;
    // formValid = true;
    if (!templateData.category) {
      toast.error('Please select Whatsapp Template category.');
      return false;
    }
    if (!templateData.headerType) {
      toast.error('Please select Whatsapp Template header type.');
      return false;
    }

    if (templateData.headerType === 'TEXT' && !templateData.headerText) {
      toast.error('Please enter Header Text.');
      return false;
    }

    if (templateData.headerType === 'TEXT' && templateData.headerText.length>60) {
      toast.error('Header length shoulde be max 60.');
      return false;
    }

    if (templateData.footerText && templateData.footerText.length>60) {
      toast.error('Footer length shoulde be max 60.');
      return false;
    }

    if (templateData.buttons.length > 0) {
      const buttons = templateData.buttons

      const qrCount = buttons.filter(b => b.type === "QUICK_REPLY").length;
      const urlCount = buttons.filter(b => b.type === "URL").length;
      const phoneCount = buttons.filter(b => b.type === "PHONE_NUMBER").length;

      if (qrCount > 3) {
        toast.error("Maximum 3 Quick Reply buttons allowed.");
        return false;
      }

      if (urlCount > 1) {
        toast.error("Only 1 URL button allowed.");
        return false;
      }

      if (phoneCount > 1) {
        toast.error("Only 1 Phone button allowed.");
        return false;
      }

      const typesUsed = [qrCount > 0, urlCount > 0, phoneCount > 0].filter(x => x).length;
      if (typesUsed > 1) {
        toast.error("Mixing button types is not allowed. Use only one type.");
        return false;
      }

      for (let button of buttons) {
        if (!button.text) {
          toast.error('Please enter Button Text.');
          return false;
        }
      }
    }
    return true
  }

  const handleSave = async (submit: boolean) => {
    const formValid = checkValidation(templateData);
    if (!formValid){
      return
    }
    let attachmentRec;
    if (file !== null) {
      attachmentRec = await handleFileUpload()
      if(!attachmentRec){
        toast.error('File have not uploaded sucessfully.');
        return
      }
    }
    const templateDataToSubmit = { ...templateData };
    if (attachmentRec){
      templateDataToSubmit['attachmentId'] = attachmentRec.id
    }

    delete templateDataToSubmit.templateImg;
    const response = await saveTemplate({
      variables: {
        templateData: templateDataToSubmit,
      }
    });

    if (response.data?.saveTemplate?.status) {
      setTemplateData({...templateData, templateId: response.data?.saveTemplate?.id})

      toast.success(`${response.data?.saveTemplate?.message}`);
      if(!submit){
        onBack();
      }
    }
  }

  const handleSaveAndSubmit = async () => {
    await handleSave(true)
    const response = await submitTemplate({
      variables: {
        templateId: templateData['templateId'],
      }
    });
    if (response.data?.submitTemplate?.success) {
      toast.success(`${response.data?.submitTemplate?.message}`);
      onBack();
    }
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file)
    }
  }

  const insertVariable = () => {
    const textarea = document.getElementById("bodyText");
    const variableMatches = textarea.value.match(/{{\d+}}/g) || [];

    var nextVariableNum = 1;
    while (variableMatches.includes(`{{${nextVariableNum}}}`)) {
      nextVariableNum++;
    }
    const newVariable = `{{${nextVariableNum}}}`

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = templateData.bodyText
    const newText =
      text.substring(0, start) + newVariable + text.substring(end);

    setTemplateData({...templateData, bodyText: newText})
  };

  const handleCategoryChange = (value) => {
    if (value === "AUTHENTICATION" && templateData.buttons.length > 0) {
      setTemplateData({
        ...templateData,
        category: value,
        buttons: []
      })
      toast.info('All buttons are removed')
    }
    else {
      setTemplateData({ ...templateData, category: value })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-start items-start">
        <PageHeader title="Create WhatsApp Template" className="w-full"
          actions={
            <>
              {preview ? (
                <TemplatePreviewDialog open={preview} setOpen={setPreview} />) : (<></>)}
              <Button onClick={() => setPreview(true)}>Preview</Button>

              <Button onClick={handleSave}>
                Save
              </Button>
              <Button onClick={handleSaveAndSubmit}>Submit</Button>

              <Button variant="outline" onClick={onBack}>Cancel</Button>
            </>
          }/>
      </div>
      <div className="flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-5xl shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <Input
                placeholder="Template ID"
                value={templateData.templateId}
                readOnly
                disabled
                hidden
              />
              <Input
                placeholder="Status"
                value={templateData.status}
                readOnly
                disabled
                hidden
              />
              <Label>Template Name</Label>
              <Input
                placeholder="Template Name"
                value={templateData.templateName}
                onChange={(e) => setTemplateData({ ...templateData, templateName: e.target.value })}
                readOnly={readOnly}
                disabled={readOnly}
              />

              <Label>Whatsapp Account</Label>
              <SelectField
                selectedVal={templateData.whatsappAccountId}
                query={ReadWaAccount}
                queryValueName="readWaAccount"
                dispalyName="name"
                placeholder="Select Account"
                onSelect={(val) => setTemplateData({ ...templateData, whatsappAccountId: val })}
                disabled={readOnly}
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Category</Label>
                  <Select value={templateData.category} onValueChange={(val) => handleCategoryChange(val)} disabled={readOnly}>
                    <SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTILITY">Utility</SelectItem>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Language</Label>
                  <Select value={templateData.language} onValueChange={(val) => setTemplateData({ ...templateData, language: val })} disabled={readOnly}>
                    <SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger>
                    <SelectContent>
                      {Languages.map((language) =>
                        <SelectItem value={language.value}>{language.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Label>Header Type</Label>
              <Select value={templateData.headerType} onValueChange={(val) => setTemplateData({ ...templateData, headerType: val })} disabled={readOnly}>
                <SelectTrigger><SelectValue placeholder="Select Header Type"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                </SelectContent>
              </Select>

              {templateData.headerType === 'TEXT' ?
                <>
                  <Label>Header Text</Label>
                  <Input
                    placeholder="Header Text"
                    value={templateData.headerText}
                    onChange={(e) => setTemplateData({ ...templateData, headerText: e.target.value })}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </>
                :
                <></>
              }
              {templateData.headerType === 'IMAGE' ?
                <>
                  <Label>Upload image</Label>
                  {attachment.originalname ?
                    <p className='p-2 mb-2 text-blue-700 rounded bg-blue-500/10 font-semibold'>
                      <span className='text-gray-600 font-normal'>Current Uploaded Image : </span>
                      <a href={getImageAbsoluteURI({
                        imageUrl: isNonEmptyString(templateData.templateImg)
                          ? templateData.templateImg : '',
                        baseUrl: VITE_BACKEND_URL,
                      }) ?? ''} target="_blank">{attachment.originalname}</a>
                    </p> : <></>}
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    placeholder="Header Text"
                    onChange={handleFileChange}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </> : <></>
              }
              {templateData.headerType === 'VIDEO' ?
                <>
                  <Label>Upload Video</Label>
                  {attachment.templateOriginaName ?
                    <p className='p-2 mb-2 text-blue-700 rounded bg-blue-500/10 font-semibold'>
                      <span className='text-gray-600 font-normal'>Current Uploaded Image : </span>
                      {attachment.templateOriginaName}
                    </p> : <></>}
                  <Input
                    type="file"
                    accept=".mp4,.3gp"
                    placeholder="Header Text"
                    onChange={handleFileChange}
                    readOnly={readOnly}
                    disabled={readOnly}
                  />
                </>
                :
                <></>
              }

              <Label>Footer Text (Optional)</Label>
              <Input
                placeholder="Footer Text"
                value={templateData.footerText}
                onChange={(e) => setTemplateData({ ...templateData, footerText: e.target.value })}
                readOnly={readOnly}
                disabled={readOnly}
              />
            </div>

            <Tabs defaultValue="users" className="space-y-6">
              <div className="w-full border-b">
                <TabsList>
                  <TabsTrigger
                    className="px-4 py-2 text-sm font-medium text-gray-600
                      border-b-2 border-transparent
                      data-[state=active]:border-blue-500
                      data-[state=active]:text-blue-600
                      hover:text-blue-500
                      transition-colors"
                    value="users"><Users className="mr-2 h-4 w-4"/> Body</TabsTrigger>
                  <TabsTrigger
                    className="px-4 py-2 text-sm font-medium text-gray-600
                      border-b-2 border-transparent
                      data-[state=active]:border-blue-500
                      data-[state=active]:text-blue-600
                      hover:text-blue-500
                      transition-colors"
                    value="buttons"><Users className="mr-2 h-4 w-4"/> Buttons</TabsTrigger>
                  <TabsTrigger
                    className="px-4 py-2 text-sm font-medium text-gray-600
                      border-b-2 border-transparent
                      data-[state=active]:border-blue-500
                      data-[state=active]:text-blue-600
                      hover:text-blue-500
                      transition-colors"
                    value="variables"><Users className="mr-2 h-4 w-4"/> Variables</TabsTrigger>
                </TabsList>
              </div>

              {/* Users */}
              <TabsContent value="users" className="space-y-4">
                <div class="flex justify-end">
                  <Button className="" onClick={() => insertVariable()}>
                    Add Variable
                  </Button>
                </div>
                <Textarea
                  id="bodyText"
                  placeholder="Hello {{1}}, thank you for joining!"
                  value={templateData.bodyText}
                  onChange={(e) => setTemplateData({ ...templateData, bodyText: e.target.value })}
                  className="mt-1 block w-full h-[25vh] rounded-md border-gray-300 shadow-sm outline-none p-2"
                  required
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </TabsContent>
              <TabsContent value="buttons" className="space-y-4">
                <TemplateButton/>
              </TabsContent>
              <TabsContent value="variables" className="space-y-4">
                <TemplateVariables/>
              </TabsContent>
            </Tabs>
            <div className="flex justify-between">

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}