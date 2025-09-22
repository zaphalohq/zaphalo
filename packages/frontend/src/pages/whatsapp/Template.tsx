import BroadcastView from '@src/components/Broadcast/BroadcastView'
import SendBroadcast from '@src/components/Broadcast/SendBroadcst'
import SubmitButton from '@src/components/UI/SubmitButton'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

import TemplateList from "@src/modules/whatsapp/components/templates/TemplateList";
import TemplateForm from "@src/modules/whatsapp/components/templates/TemplateForm";
import { TemplateProvider } from '@src/modules/whatsapp/Context/TemplateContext';

const WhatsappTemplate = () => {
  const [showForm, setShowForm] = useState(false);
  const [record, setRecord] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {showForm ? (
        <TemplateProvider>
          <TemplateForm recordId={record} readOnly={readOnly} onBack={() => setShowForm(false)} />
        </TemplateProvider>
      ) : (
        <TemplateList
          showForm={setShowForm}
          setReadOnly={setReadOnly}
          setRecord={setRecord}
          onCreate={() => {
            setRecord(false)
            setReadOnly(false)
            setShowForm(true)
          }} />
      )}
    </div>
  );
}

export default WhatsappTemplate