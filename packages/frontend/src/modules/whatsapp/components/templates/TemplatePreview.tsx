import React, { useEffect, useMemo, useState, useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { VITE_BACKEND_URL } from '@src/config';
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
import { GetTemplate, FindTemplateByDbId } from "@src/generated/graphql"
import { TemplateContext } from '@src/modules/whatsapp/Context/TemplateContext';
import { isDefined } from '@src/utils/validation/isDefined';

interface TemplatePreviewProps {
  templateData : any,
  attachment? : any
}

export const TemplatePreview = ({ templateDataPreview, attachmentDataPreview }: TemplatePreviewProps) => {
  let templatePreview;
  let attachmentPreview;

  templatePreview = templateDataPreview
  attachmentPreview = attachmentDataPreview

  return (
    <>
      {templatePreview.headerType !== 'NONE' || templatePreview.footerText || templatePreview.bodyText ?
        <div className="bg-white max-w-xs min-w-xs mx-auto mt-15 overflow-hidden shadow-md font-sans border border-[#d0e3ea] pb-1">
          {templatePreview.headerType === 'IMAGE' && <img
            src={`${VITE_BACKEND_URL}/files/${templatePreview?.templateImg || templatePreview.templateImg}`}
            alt="Media"
            className="w-full min-h-50 max-h-70 object-cover p-2 rounded"
          />}
          {templatePreview.headerType === 'TEXT' &&
            <div className="px-3 pt-2 pb-1 font-semibold">{templatePreview.headerText}</div>}
          {templatePreview.headerType === 'VIDEO' &&
            <iframe
              src={`${VITE_BACKEND_URL}/files/${templatePreview?.templateImg}`}
              className="w-full min-h-50 max-h-60 object-cover p-2 rounded"
            />}
          {templatePreview.headerType === 'DOCUMENT' &&
            <iframe
              src={`${VITE_BACKEND_URL}/files/${templatePreview?.templateImg}`}
              className="w-full min-h-50 max-h-60 object-cover p-2 rounded"
            />}
          <div className="px-3 pb-2 text-sm text-gray-800">
            <p className="mb-2 whitespace-pre-line">
              {templatePreview.bodyText}
            </p>
          </div>
          <div className="px-3 pb-2 border-b-2 border-gray-200 flex justify-between ">
            <p className="text-[13.5px] text-gray-500">{templatePreview.footerText} </p>
            <p className="text-[10px] text-gray-500 self-end">12:00</p>
          </div>
          {/* {templatePreviewData?.button?.length !== 0 && */}
          {templatePreview?.button &&
            templatePreview?.button?.map((button: any, index: number) => <div key={index} className="flex gap-2 items-center justify-center p-2 text-green-500 ">
              <FiExternalLink />
              <button className="text-sm font-semibold text-left">
                {button.text}
              </button>
            </div>)}
        </div>
        : <></>}
    </>
  );
};

type Role = "Admin" | "Member" | "Viewer"

const TemplatePreviewDialog = ({ templateId, open, setOpen, actions = false, } : templateProps) => {
    const [loading, setLoading] = useState(false);
    let templateView;
    let attachment;

    if (!templateId){
      const { templateData, setTemplateData, attachment, setAttachment }: any = useContext(TemplateContext)
      templateView = {...templateData}
    }
    else if(templateId){
      const { data : templateData, loading: templateLoading, error, refetch } = useQuery(GetTemplate, {
          variables: {
              templateId: templateId.toString()
          },
      })
      templateView = templateData?.getTemplate.template;
    }
    return (
      <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template Name : </DialogTitle>
            <DialogDescription>{templateView?.templateName || ""}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {isDefined(templateView) ? (
            <div>
              <TemplatePreview
               templateDataPreview={templateView} attachmentPreview={attachment}
               />
            </div>
            ) : (<></>)}
          </div>
          <DialogFooter>
             <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    )
};

export default TemplatePreviewDialog;