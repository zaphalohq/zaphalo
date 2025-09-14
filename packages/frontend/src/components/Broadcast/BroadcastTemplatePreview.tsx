import React, { useEffect, useMemo, useState } from "react";

import { Input } from "@components/UI/input"
import { Label } from "@components/UI/label"
import { Button } from "@components/UI/button"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/UI/select"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@components/UI/dialog"
import { Textarea } from "@components/UI/textarea"

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
} from "lucide-react";
import { useMutation, useQuery } from '@apollo/client'
import { FindTemplateByDbId } from "@src/generated/graphql"
import TemplatePreview from "../Template/TemplatePreview"


type Role = "Admin" | "Member" | "Viewer"

const BroadcastTemplatePreview = ({dbTemplateId } : templateProps) => {

    const { data : templateData, loading: templateLoading, error, refetch } = useQuery(FindTemplateByDbId,{
        variables: {
            dbTemplateId
        },
        skip: !dbTemplateId
    })
    const [previewData, setPreviewData] = useState<any>({})
    useEffect(() => {
        if(templateData && !templateLoading)
            setPreviewData(templateData.findtemplateByDbId);
    },[templateData,templateLoading])
    return (
    <Dialog>
      <DialogTrigger asChild>
        <span>Preview Template</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Template Name :</DialogTitle>
          <DialogDescription>{' ' + previewData?.templateName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <TemplatePreview
             templatePreviewData={previewData} 
             />
          </div>
        </div>
        <DialogFooter>
           <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default BroadcastTemplatePreview;