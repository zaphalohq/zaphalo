import BroadcastView from '@src/components/Broadcast/BroadcastView'
import SendBroadcast from '@src/components/Broadcast/SendBroadcst'
import SubmitButton from '@src/components/UI/SubmitButton'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

import TemplateList from "@src/modules/whatsapp/components/templates/TemplateList";
import TemplateForm from "@src/modules/whatsapp/components/templates/TemplateForm";
import { TemplateProvider } from '@src/modules/whatsapp/Context/TemplateContext';
import TemplatePreviewDialog from '@src/modules/whatsapp/components/templates/TemplatePreview';
import TemplateBroadcast from '@src/modules/whatsapp/components/TemplateBroadcast'

const WhatsappTemplate = () => {
  const [showForm, setShowForm] = useState(false);
  const [record, setRecord] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isBroadCastVis, setIsBroadCastVis] = useState(false)
  const [templateId, setTemplateId] = useState(null)

  return (
    <TemplateProvider>
      <div className="min-h-screen bg-gray-50">
        {showForm ? (
          <TemplateForm recordId={record} readOnly={readOnly} onBack={() => {
            setRecord(null)
            setShowForm(false);
          }} />
        ) : isBroadCastVis ?
          <TemplateBroadcast
            templateId={templateId}
            onBack={()=>{
              setIsBroadCastVis(false)
              setTemplateId(null)
            }}
          /> : (
            <TemplateList
              showForm={setShowForm}
              setReadOnly={setReadOnly}
              setRecord={setRecord}
              setPreview={setPreview}
              setTemplateId={setTemplateId}
              setIsBroadCastVis={setIsBroadCastVis}
              onCreate={() => {
                setRecord(false)
                setReadOnly(false)
                setShowForm(true)
              }} />
          )}
        {preview ? (
          <TemplatePreviewDialog open={preview} setOpen={setPreview} templateId={preview} />
        ) : (<></>)
        }
      </div>
    </TemplateProvider>
  );
}

export default WhatsappTemplate