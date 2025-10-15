import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { Input } from "@src/components/UI/input";
import { Button } from "@src/components/UI/button";
import { Card, CardContent } from "@src/components/UI/card";
import SelectField from "@src/components/UI/ApiDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@src/components/UI/select";
import {
  ReadWaAccount,
  ReadWaTemplate,
  ReadMailingList,
  GetBroadcast,
  SaveBroadcast,
  SendBroadcast
} from "@src/generated/graphql";
import { toast } from 'react-toastify';
import { isDefined } from '@src/utils/validation/isDefined';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { formatLocalDate, formatUTCDate } from '@src/utils/formatLocalDate';
import { Label } from "@src/components/UI/label";


export default function BroadcastForm({ onBack, broadcastId, readOnly = false }) {
  const [broadcastData, setBroadcastData] = useState({
    broadcastId: '',
    broadcastName: '',
    whatsappAccountId: '',
    templateId: '',
    contactListId: '',
    status: '',
    scheduledAt: '',
  })
  const [errors, setErrors] = useState({});
  if (isDefined(broadcastId)) {
    const { data: broadcastViewData, loading: viewLoading, error: viewError } = useQuery(GetBroadcast, {
      variables: {
        broadcastId
      },
      fetchPolicy: "cache-and-network",
    })
    const broadcastView = broadcastViewData?.getBroadcast?.broadcast;
    if (broadcastView && !broadcastData.broadcastId) {
      setBroadcastData({
        broadcastId: broadcastView.id,
        broadcastName: broadcastView.name,
        whatsappAccountId: broadcastView.whatsappAccount.id,
        templateId: broadcastView.template.id,
        contactListId: broadcastView.contactList.id,
        scheduledAt: formatUTCDate(broadcastView.scheduledAt),
        status: broadcastView.status,
      })
      if (broadcastView.state != 'New') {
        readOnly = false
      }
    }
  }


  const [saveBroadcast, { data, loading, error }] = useMutation(SaveBroadcast, {
    onCompleted: (data) => {
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });


  const handleSave = async (status: string) => {
    if (
      !broadcastData.whatsappAccountId ||
      !broadcastData.templateId ||
      !broadcastData.contactListId ||
      !broadcastData.broadcastName
    ) {
      toast.error('Please fill all required fields before broadcasting.');
      return;
    }

    type toSubmiteData = {
      [key: string]: any;
    };
    const toSubmiteData: toSubmiteData = {};
    toSubmiteData.broadcastName = broadcastData.broadcastName
    toSubmiteData.whatsappAccountId = broadcastData.whatsappAccountId
    toSubmiteData.templateId = broadcastData.templateId
    toSubmiteData.contactListId = broadcastData.contactListId
    toSubmiteData.scheduledAt = broadcastData.scheduledAt | ''

    toSubmiteData.status = "new"

    if (broadcastData.broadcastId) {
      toSubmiteData.broadcastId = broadcastData.broadcastId
    }
    if (status) {
      toSubmiteData.status = status
    }

    const response = await saveBroadcast({
      variables: {
        broadcastData: toSubmiteData
      }
    });

    const broadcast = response.data?.saveBroadcast?.broadcast;
    if (response.data?.saveBroadcast?.status) {
      setBroadcastData({
        broadcastId: broadcast.id,
        broadcastName: broadcast.broadcastName,
        whatsappAccountId: broadcast.whatsappAccount.id,
        templateId: broadcast.template.id,
        contactListId: broadcast.contactList.id,
        scheduledAt: broadcast.scheduledAt,
        status: broadcast.status,
      })
      toast.success(`${response.data?.saveBroadcast?.message}`);
      onBack();
    }
  }

  const handleSaveAndSend = async () => {
    handleSave("in_progress")
    onBack();
  }

  const handleSaveAndSchedule = async () => {
    if (!broadcastData.scheduledAt) {
      toast.error('Please select schedule date.');
      return;
    }
    handleSave("scheduled")
    onBack();
  }

  const handleSaveAndCancel = async () => {
    handleSave("cancel")
    onBack();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!broadcastData.broadcastName.trim()) newErrors.broadcastName = "Broadcast name is required";
    if (!broadcastData.whatsappAccountId.trim()) newErrors.whatsappAccountId = "Whatsapp Account is required";
    if (!broadcastData.templateId.trim()) newErrors.templateId = "Template is required";
    if (!broadcastData.contactListId.trim()) newErrors.contactListId = "Contact List is required";
    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8 space-y-6">
           {!broadcastId ? (
            <h2 className="text-2xl font-bold text-center">Create Broadcast</h2>
            ) :
           (
            <h2 className="text-2xl font-bold text-center">Edit Broadcast</h2>
            )
         }
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
              <Input
                placeholder="Broadcast ID"
                value={broadcastData.broadcastId}
                readOnly
                disabled
                hidden
              />
              <Input
                placeholder="Status"
                value={broadcastData.status}
                readOnly
                disabled
                hidden
              />

              <Label>Broadcast Title</Label>
              <Input
                placeholder="Broadcast Title"
                className={errors.broadcastName ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-gray-300" : ""}
                value={broadcastData.broadcastName}
                onChange={(e) => setBroadcastData({ ...broadcastData, broadcastName: e.target.value })}
                readOnly={readOnly}
                disabled={readOnly}
              />

              <Label>Whatsapp Account</Label>
              <SelectField
                className={errors.broadcastName ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-gray-300" : ""}
                selectedVal={broadcastData.whatsappAccountId}
                query={ReadWaAccount}
                queryValueName="readWaAccount"
                dispalyName="name"
                placeholder="Select Account"
                onSelect={(val) => setBroadcastData({ ...broadcastData, whatsappAccountId: val })}
                disabled={readOnly}
              />

              <Label>Template</Label>
              <SelectField
                className={errors.broadcastName ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-gray-300" : ""}
                selectedVal={broadcastData.templateId}
                query={ReadWaTemplate}
                queryValueName="readWaTemplate"
                filter={{ account: { id: broadcastData.whatsappAccountId || null } }}
                dispalyName="templateName"
                placeholder="Select Template"
                onSelect={(val) => setBroadcastData({ ...broadcastData, templateId: val })}
                disabled={readOnly}
              />
              
              <Label>Contact List</Label>
              <SelectField
                className={errors.contactListId ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-gray-300" : ""}
                selectedVal={broadcastData.contactListId}
                query={ReadMailingList}
                queryValueName="readMailingList"
                dispalyName="mailingListName"
                placeholder="Select Contact List"
                onSelect={(val) => setBroadcastData({ ...broadcastData, contactListId: val })}
                disabled={readOnly}
                required
              />

              <Label className="w-full">Schedule Date</Label>
              <div className="flex w-full">
                <DatePicker
                  selected={broadcastData.scheduledAt}
                  onChange={(val) => setBroadcastData({ ...broadcastData, scheduledAt: val })}
                  showTimeSelect
                  dateFormat="Pp"
                  disabled={readOnly}
                  className={`border p-2 rounded 
                  flex h-10 items-center 
                  justify-between rounded-md 
                  bg-background px-3 py-2 
                  text-sm ring-offset-background 
                  placeholder:text-muted-foreground 
                  focus:outline-none focus:ring-2 
                  focus:ring-ring focus:ring-offset-2 
                  disabled:cursor-not-allowed disabled:opacity-50 
                  [&>span]:line-clamp-1 w-full`} />
              </div>
            </div>

            <div className="flex justify-left my-4">

              {!readOnly && (
                <Button className="m-1" onClick={() => handleSave()}>Save</Button>
              )}
              {!readOnly && (
                <Button className="m-1" onClick={() => handleSaveAndSend()}>Send</Button>
              )}
              {!readOnly && (
                <Button className="m-1" onClick={() => handleSaveAndSchedule()}>Schedule</Button>
              )}
              {broadcastId && (
                <Button className="m-1" variant="outline" onClick={() => handleSaveAndCancel()}>
                  Cancel
                </Button>
              )}
                <Button className="m-1" variant="outline" onClick={onBack}>
                  Back
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
