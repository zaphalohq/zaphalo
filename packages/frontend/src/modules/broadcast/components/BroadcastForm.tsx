import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { Input } from "@src/components/UI/input";
import { Button } from "@src/components/UI/button";
import { Card, CardContent } from "@src/components/UI/card";
import SelectField from "@src/components/UI/ApiDropdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/UI/select";
import { 
  ReadWaAccount,
  ReadWaTemplate,
  ReadMailingList,
  SEND_TEMPLATE_TO_WHATSAPP } from "@src/generated/graphql";
import { toast } from 'react-toastify';

export default function BroadcastForm({ onBack, readOnly=false }) {
    const [broadcastData, setBroadcastData] = useState({
        broadcastName: '',
        accountId: '',
        templateId: '',
        mailingListId: '',
    })
    const [sendTemplateToWhatssapp, { data, loading, error }] = useMutation(SEND_TEMPLATE_TO_WHATSAPP);

    const handleSave = async () => {
      if (
          !broadcastData.accountId ||
          !broadcastData.templateId ||
          !broadcastData.mailingListId ||
          !broadcastData.broadcastName
      ) {
          toast.error('Please fill all required fields before broadcasting.');
          return;
      }

      try {
          const response = await sendTemplateToWhatssapp({
              variables: {
                  broadcastData
              },
          });


          if (response.data?.BroadcastTemplate?.success) {
              toast.success(`${response.data?.BroadcastTemplate?.message}`);
              setIsSendBroadcastVis(false)
          }
      } catch (err) {
          console.error("Mutation error:", err);
      }
      onBack();
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Create New Broadcast</h2>

          <div className="space-y-4">
            <Input
              placeholder="Broadcast Name"
              value={broadcastData.broadcastName}
              onChange={(e) => setBroadcastData({ ...broadcastData, broadcastName: e.target.value })}
              readOnly={readOnly}
              disabled={readOnly}
            />

            <SelectField
              query={ReadWaAccount}
              queryValueName="readWaAccount"
              dispalyName="name"
              placeholder="Select Account"
              onSelect={(val) => setBroadcastData({ ...broadcastData, accountId: val })}
              disabled={readOnly}
            />

            <SelectField
              query={ReadWaTemplate}
              queryValueName="readWaTemplate"
              dispalyName="templateName"
              placeholder="Select Template"
              onSelect={(val) => setBroadcastData({ ...broadcastData, templateId: val })}
              disabled={readOnly}
            />

            <SelectField
              query={ReadMailingList}
              queryValueName="readMailingList"
              dispalyName="mailingListName"
              placeholder="Select Contact List"
              onSelect={(val) => setBroadcastData({ ...broadcastData, mailingListId: val })}
              disabled={readOnly}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Broadcast</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
