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
  templateData: any,
  attachment?: any
}

export const TemplatePreview = ({ templateDataPreview, attachmentDataPreview }: TemplatePreviewProps) => {
  let templatePreview;
  let attachmentPreview;

  templatePreview = templateDataPreview
  attachmentPreview = attachmentDataPreview

  const getBodyWithValues = (templateData: any) => {
    if (!templateData?.bodyText) return templateData?.bodyText || "";

    const variableMatches = templateData.bodyText.match(/{{\d+}}/g) || [];

    let newBodyText = templateData.bodyText;
    variableMatches.forEach((variableName: string) => {
      const matchedVariable = templateData.variables?.find(
        (v: any) => v.name === variableName
      );

      if (matchedVariable) {
        if (matchedVariable.type === "STATIC" && matchedVariable.value) {
          newBodyText = newBodyText.replaceAll(variableName, matchedVariable.value);
        }
        else {
          newBodyText = newBodyText.replaceAll(variableName, matchedVariable.sampleValue || variableName);
        }
      }
    });

    return newBodyText;
  };


  return (
    <>
      {templatePreview.headerType !== 'NONE' || templatePreview.footerText || templatePreview.bodyText ?
        <div className="bg-[#efeae2] flex flex-col max-w-md mx-auto rounded-2xl border border-gray-300 shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-white text-white px-4 py-3 flex items-center shadow-md">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <h3 className="font-medium text-black">Template Preview</h3>
              <p className="text-xs text-black">Online</p>
            </div>
          </div>
          {/* Chat Messages Area */}
          <div className="px-4 py-6 bg-[#efeae2]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23d9d0c5' fill-opacity='0.1'/%3E%3C/svg%3E')" }}>

            {/* Template Message Bubble */}
            <div className="flex justify-start">
              <div className="bg-white max-w-xs min-w-xs overflow-hidden font-sans rounded-lg shadow-sm">
                {templatePreview.headerType === 'IMAGE' && <img
                  src={`${VITE_BACKEND_URL}/files/${templatePreview?.templateImg || templatePreview.templateImg}`}
                  alt="Media"
                  className="w-full min-h-50 max-h-70 object-cover rounded-t-lg"
                />}
                {templatePreview.headerType === 'TEXT' &&
                  <div className="px-3 pt-3 pb-1 font-semibold text-gray-900">{templatePreview.headerText}</div>}
                {templatePreview.headerType === 'VIDEO' &&
                  <iframe
                    src={`${VITE_BACKEND_URL}/files/${templatePreview?.templateImg}`}
                    className="w-full min-h-50 max-h-60 object-cover rounded-t-lg"
                  />}
                {templatePreview.headerType === 'DOCUMENT' &&
                  <iframe
                    src={`${VITE_BACKEND_URL}/files/${templatePreview?.templateImg}`}
                    className="w-full min-h-50 max-h-60 object-cover rounded-t-lg"
                  />}
                <div className="px-3 pb-1 text-sm text-gray-900">
                  <p className="mb-2 whitespace-pre-line">
                      {getBodyWithValues(templatePreview)}
                  </p>
                </div>
                <div className="px-3 pb-2 flex justify-between items-end gap-4">
                  <p className="text-[13px] text-gray-600">{templatePreview.footerText}</p>
                  <p className="text-[11px] text-gray-500 flex-shrink-0">12:00</p>
                </div>
                {templatePreview?.buttons &&
                  templatePreview?.buttons?.map((button: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center justify-center py-2.5 px-3 text-[#00a884] border-t border-gray-300/50">
                      <FiExternalLink className="w-4 h-4" />
                      <button className="text-sm font-medium">
                        {button.text}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        : <></>}
    </>
  );
};

type Role = "Admin" | "Member" | "Viewer"

const TemplatePreviewDialog = ({ templateId, open, setOpen, actions = false, }: templateProps) => {
  const [loading, setLoading] = useState(false);
  let templateView;
  let attachment;

  if (!templateId) {
    const { templateData, setTemplateData, attachment, setAttachment }: any = useContext(TemplateContext)
    templateView = { ...templateData }
  }
  else if (templateId) {
    const { data: templateData, loading: templateLoading, error, refetch } = useQuery(GetTemplate, {
      variables: {
        templateId: templateId.toString()
      },
    })
    templateView = templateData?.getTemplate.template;
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-auto">
          <DialogHeader className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
            <DialogTitle className="text-sm font-medium text-gray-600">Template Name : </DialogTitle>
            <DialogDescription className="text-base font-semibold text-gray-900 mt-1">{templateView?.templateName || ""}</DialogDescription>
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
              <Button variant="outline" className="mt-2" onClick={() => setOpen(false)}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default TemplatePreviewDialog;