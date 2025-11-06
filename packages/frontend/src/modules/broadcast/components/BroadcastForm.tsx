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
  SendBroadcast,
  CancelBroadCast,
  ScheduleBroadCast,
  SendBroadCast
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
    limit: null,
    intervalType: '',
    status: '',
    scheduledAt: '',
  })

  useEffect(() => {
    console.log("innnnnnnn", broadcastData.intervalType)
  }, [broadcastData.intervalType])
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
        limit: broadcastView.limit,
        intervalType: broadcastView.intervalType,
        scheduledAt: broadcastView.scheduledAt ? formatUTCDate(broadcastView.scheduledAt) : '',
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

  const [sendBroadcast] = useMutation(SendBroadCast, {
    onError: (err) => {
    },
  });

  const [scheduleBroadcast] = useMutation(ScheduleBroadCast, {
    onError: (err) => {
    },
  });

  const [cancelBroadcast] = useMutation(CancelBroadCast, {
    onError: (err) => {
    },
  });


  const handleSave = async () => {
    if (
      !broadcastData.whatsappAccountId ||
      !broadcastData.templateId ||
      !broadcastData.contactListId ||
      !broadcastData.broadcastName
    ) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (broadcastData.limit && !broadcastData.intervalType) {
      toast.error('Please select an interval type when limit is set.');
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
    if (broadcastData.scheduledAt) {
      toSubmiteData.scheduledAt = broadcastData.scheduledAt
    }

    if (broadcastData.limit !== null && broadcastData.limit !== undefined) {
      toSubmiteData.limit = broadcastData.limit;
    }

    if (broadcastData.broadcastId) {
      toSubmiteData.broadcastId = broadcastData.broadcastId
    }

    if (broadcastData.intervalType) {
      toSubmiteData.intervalType = broadcastData.intervalType;
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
        broadcastName: broadcast.name,
        whatsappAccountId: broadcast.whatsappAccount.id,
        templateId: broadcast.template.id,
        contactListId: broadcast.contactList.id,
        limit: broadcast?.limit,
        intervalType:broadcast?.intervalType,
        scheduledAt: broadcast.scheduledAt ? formatUTCDate(broadcast.scheduledAt) : '',
        status: broadcast.status,
      })
      console.log(response.data?.saveBroadcast)
      toast.success(`${response.data?.saveBroadcast?.message}`);
    }
    return broadcast.id
  }

  const handleSaveAndCancel = async () => {
    // handleSave("cancel")
    const response = await cancelBroadcast({
      variables: {
        broadcastId: broadcastData.broadcastId
      }
    });
    if (response.errors) {
      toast.error(response.errors.message);
    } else if (response.data.cancelBroadcast.success === false) {
      // Backend returned failure message in data
      toast.info(response.data.cancelBroadcast.message);
    } else {
      toast.success(response.data.cancelBroadcast.message);
      onBack();
    }
  }

  const handleSaveAndSend = async () => {
    if (!broadcastData.scheduledAt) {
      toast.error('Please select schedule date.');
      return;
    }
    const id = await handleSave();
    if (!id) {
      toast.error('Broadcast not saved.');
      return;
    }
    const response = await sendBroadcast({
      variables: {
        broadcastId: id
      }
    });
    if (response.errors) {
      toast.error(response.errors.message);
    } else if (response.data.sendBroadcast.success === false) {
      // Backend returned failure message in data
      toast.info(response.data.sendBroadcast.message);
    } else {
      toast.success(response.data.sendBroadcast.message);
      onBack();
    }
  }

  const handleSaveAndSchedule = async () => {
    if (!broadcastData.scheduledAt) {
      toast.error('Please select schedule date.');
      return;
    }
    const id = await handleSave();
    if (!id) {
      toast.error('Broadcast not saved.');
      return;
    }
    const response = await scheduleBroadcast({
      variables: {
        broadcastId: id
      }
    });
    if (response.errors) {
      toast.error(response.errors.message);
    } else if (response.data.scheduleBroadcast.success === false) {
      // Backend returned failure message in data
      toast.info(response.data.scheduleBroadcast.message);
    } else {
      toast.success(response.data.scheduleBroadcast.message);
      onBack();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!broadcastData.broadcastName.trim()) newErrors.broadcastName = "Broadcast name is required";
    if (!broadcastData.whatsappAccountId.trim()) newErrors.whatsappAccountId = "Whatsapp Account is required";
    if (!broadcastData.templateId.trim()) newErrors.templateId = "Template is required";
    if (!broadcastData.contactListId.trim()) newErrors.contactListId = "Contact List is required";
    if (broadcastData.limit && !broadcastData.intervalType) {
      newErrors.intervalType = "Please select interval type when limit is set";
    }
    if (broadcastData.intervalType && !broadcastData.limit) {
      newErrors.limit = "Please enter limit when interval type is selected";
    }

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
                className={errors.whatsappAccountId ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-gray-300" : ""}
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
                className={errors.templateId ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-gray-300" : ""}
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

              <Label>Message Limit</Label>
              <Input
                type="number"
                placeholder="Set Message Limit"
                value={broadcastData.limit ?? ''}
                min={1}
                onChange={(e) => {
                  const value = e.target.value;
                  setBroadcastData({
                    ...broadcastData,
                    limit: value ? Number(value) : null,
                  });
                }}
              />

              <Label>Interval Type</Label>
              <Select
                value={broadcastData.intervalType}
                onValueChange={(val) => setBroadcastData({ ...broadcastData, intervalType: val })}
                disabled={!broadcastData.limit}
              >
                <SelectTrigger className={errors.intervalType ? "border-red-500 focus-visible:ring-red-500" : ""}>
                  <SelectValue placeholder="Select Interval Type For Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Daily</SelectItem>
                  <SelectItem value="MINUTE">Per Miniute</SelectItem>
                  <SelectItem value="HOUR">Per Hour</SelectItem>
                </SelectContent>
              </Select>

              <Label className="w-full">Schedule Date</Label>
              <div className="flex w-full">
                <DatePicker
                  selected={broadcastData.scheduledAt ? broadcastData.scheduledAt : ''}
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
              {readOnly && (<Label>Status</Label>)}
              {readOnly && (<Input
                placeholder="Status"
                value={broadcastData.status}
                readOnly
                disabled
              />)}
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
              {broadcastData.broadcastId && (
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
