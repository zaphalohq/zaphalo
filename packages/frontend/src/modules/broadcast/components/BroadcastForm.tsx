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
    toSubmiteData.scheduledAt = broadcastData.scheduledAt

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Create New Broadcast</h2>

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

            <Label>Broadcast Name</Label>
            <Input
              placeholder="Enter Broadcast Name"
              value={broadcastData.broadcastName}
              onChange={(e) => setBroadcastData({ ...broadcastData, broadcastName: e.target.value })}
              readOnly={readOnly}
              disabled={readOnly}
            />

            <Label>Whatsapp Account</Label>
            <SelectField
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
              selectedVal={broadcastData.templateId}
              query={ReadWaTemplate}
              queryValueName="readWaTemplate"
              filter={{ account: { id: broadcastData.whatsappAccountId || null } }}
              dispalyName="templateName"
              placeholder="Select Template"
              onSelect={(val) => setBroadcastData({ ...broadcastData, templateId: val })}
              disabled={readOnly}
            />
            
            <Label>Mailing List</Label>
            <SelectField
              selectedVal={broadcastData.contactListId}
              query={ReadMailingList}
              queryValueName="readMailingList"
              dispalyName="mailingListName"
              placeholder="Select Contact List"
              onSelect={(val) => setBroadcastData({ ...broadcastData, contactListId: val })}
              disabled={readOnly}
            />

            <Label>Date</Label>
            <DatePicker
              selected={broadcastData.scheduledAt}
              onChange={(val) => setBroadcastData({ ...broadcastData, scheduledAt: val })}
              showTimeSelect
              dateFormat="Pp"
              className="border p-2 rounded"
            />
          </div>

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
  );
}
