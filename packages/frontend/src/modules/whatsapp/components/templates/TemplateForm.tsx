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
  ReadWaTemplate,
  ReadMailingList,
  GetBroadcast,
  SaveBroadcast,
  SendBroadcast } from "@src/generated/graphql";
import { toast } from 'react-toastify';
import { isDefined } from '@src/utils/validation/isDefined';
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader';
import { Label } from "@components/UI/label";
import { Languages } from "@src/modules/whatsapp/language-code";
import TemplateButton from "@src/modules/whatsapp/components/templates/TemplateButton";
import TemplateVariables from "@src/modules/whatsapp/components/templates/TemplateVariables";
import { TemplateContext } from '@src/modules/whatsapp/Context/TemplateContext';

// import { TemplateProvider } from '@components/Context/TemplateContext';

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

export default function TemplateForm({ onBack, recordId, readOnly=false }) {
  const [active, setActive] = useState("overview");
  const { templateData, setTemplateData }: any = useContext(TemplateContext)


  // if (isDefined(recordId)){
  //   const { data : broadcastViewData, loading: viewLoading, error: viewError } = useQuery(GetBroadcast, {
  //     variables: {
  //         recordId
  //     },
  //     fetchPolicy: "cache-and-network",
  //   })
  //   const broadcastView = broadcastViewData?.getBroadcast?.broadcast;

  //   if (broadcastView && !templateData.broadcastId){
  //     setBroadcastData({
  //       broadcastId: broadcastView.id,
  //       broadcastName: broadcastView.name,
  //       whatsappAccountId: broadcastView.whatsappAccount.id,
  //       templateId: broadcastView.template.id,
  //       contactListId: broadcastView.contactList.id,
  //       state: broadcastView.status,
  //     })
  //     if (broadcastView.state != 'New'){
  //       readOnly = false
  //     }
  //   }
  // }


  // const [saveBroadcast, { data, loading, error }] = useMutation(SaveBroadcast, {
  //   onCompleted: (data) => {
  //   },
  //   onError: (err) => {
  //     toast.error(`${err}`);
  //   },
  // });


  // const handleSave = async (status: string) => {
  //   if (
  //     !broadcastData.whatsappAccountId ||
  //     !broadcastData.templateId ||
  //     !broadcastData.contactListId ||
  //     !broadcastData.broadcastName
  //     ) {
  //     toast.error('Please fill all required fields before broadcasting.');
  //   return;
  //   }

  //   type toSubmiteData = {
  //     [key: string]: any;
  //   };
  //   const toSubmiteData: toSubmiteData = {};
  //   toSubmiteData.broadcastName = broadcastData.broadcastName
  //   toSubmiteData.whatsappAccountId = broadcastData.whatsappAccountId
  //   toSubmiteData.templateId = broadcastData.templateId
  //   toSubmiteData.contactListId = broadcastData.contactListId
  //   toSubmiteData.status = "new"



  //   if (broadcastData.broadcastId){
  //     toSubmiteData.broadcastId = broadcastData.broadcastId
  //   }
  //   if (status){
  //     toSubmiteData.status = status
  //   }

  //   const response = await saveBroadcast({
  //     variables: {
  //       broadcastData: toSubmiteData
  //     }
  //   });

  //   const broadcast = response.data?.saveBroadcast?.broadcast;
  //   if (response.data?.saveBroadcast?.status) {
  //     setBroadcastData({
  //       broadcastId: broadcast.id,
  //       broadcastName: broadcast.broadcastName,
  //       accountId: broadcast.whatsappAccount.id,
  //       templateId: broadcast.template.id,
  //       contactListId: broadcast.contactList.id,
  //       status: broadcast.status,
  //     })
  //     toast.success(`${response.data?.saveBroadcast?.message}`);
  //     onBack();
  //   }
  // }

  const handleSaveAndSend = async () => {
    handleSave("in_progress")
    onBack();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageHeader title="Create WhatsApp Template" className="w-full"
          actions={
          <>
            <Button>
              Save
            </Button>
          </>
        }/>
      </div>
      <div className="flex items-start justify-start bg-gray-50 px-4">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Broadcast ID"
              value={templateData.broadcastId}
              readOnly
              disabled
              hidden
            />
            <Input
              placeholder="Status"
              value={templateData.state}
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
                <Select value={templateData.category} onValueChange={(val) => setTemplateData({ ...templateData, category: val })}>
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
                <Select value={templateData.category} onValueChange={(val) => setTemplateData({ ...templateData, category: val })}>
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
            <Select value={templateData.category} onValueChange={(val) => setTemplateData({ ...templateData, headerType: val })}>
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
                {/*{selectedTemplateInfo.templateOriginaName ?
                  <p className='p-2 mb-2 text-blue-700 rounded bg-blue-500/10 font-semibold'>
                    <span className='text-gray-600 font-normal'>Current Uploaded Image : </span>
                    {selectedTemplateInfo.templateOriginaName}
                  </p> : <></>}*/}
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  placeholder="Header Text"
                  value={templateData.headerText}
                  // onChange={(e) => setTemplateData({ ...templateData, headerText: e.target.value })}
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </> : <></>
            }
            {templateData.headerType === 'VIDEO' ?
              <>
              <Label>Upload Video</Label>
                {/*{selectedTemplateInfo.templateOriginaName ?
                  <p className='p-2 mb-2 text-blue-700 rounded bg-blue-500/10 font-semibold'>
                    <span className='text-gray-600 font-normal'>Current Uploaded Image : </span>
                    {selectedTemplateInfo.templateOriginaName}
                  </p> : <></>}*/}
                <Input
                  type="file"
                  accept=".mp4,.3gp"
                  placeholder="Header Text"
                  value={templateData.headerText}
                  // onChange={(e) => setTemplateData({ ...templateData, headerText: e.target.value })}
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
                <Textarea
                  placeholder="Hello {{1}}, thank you for joining!"
                  value={templateData.bodyText}
                  onChange={(e) => setTemplateData({ ...templateData, templateName: e.target.value })}
                  className="mt-1 block w-full h-[25vh] rounded-md border-gray-300 shadow-sm outline-none p-2"
                  required
                />
              </TabsContent>
              <TabsContent value="buttons" className="space-y-4">
                <TemplateButton setTemplateData2={templateData}/>
              </TabsContent>
              <TabsContent value="variables" className="space-y-4">
                <TemplateVariables setTemplateData2={setTemplateData}/>
              </TabsContent>
            </Tabs>
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={() => handleSave()}>Save Broadcast</Button>
            <Button onClick={() => handleSaveAndSend()}>Send Broadcast</Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
)}