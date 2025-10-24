import BroadcastView from '@src/components/Broadcast/BroadcastView'
import SendBroadcast from '@src/components/Broadcast/SendBroadcst'
import SubmitButton from '@src/components/UI/SubmitButton'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'
import BroadcastList from "@src/modules/broadcast/components/BroadcastList";
import BroadcastForm from "@src/modules/broadcast/components/BroadcastForm";
import TemplatePreviewDialog from '@src/modules/whatsapp/components/templates/TemplatePreview';
import ContactListView from '@src/modules/broadcast/components/ContactListView'

const Broadcast = () => {
  const [showForm, setShowForm] = useState(false);
  const [broadcast, setBroadcast] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [preview, setPreview] = useState(false);
 
  return (
    <div className="min-h-screen bg-gray-50">
      {showForm ? (
        <BroadcastForm broadcastId={broadcast} readOnly={readOnly} onBack={() => setShowForm(false)} />
      ) : (
        <BroadcastList
          showForm={setShowForm}
          setReadOnly={setReadOnly}
          setBroadcast={setBroadcast}
          setPreview={setPreview}
          onCreate={() => {
            setBroadcast(false)
            setReadOnly(false)
            setShowForm(true)
          }} />
      )}
      {preview ? (
        <TemplatePreviewDialog open={preview} setOpen={setPreview} templateId={preview} />
      ) : (<></>)
      }
    </div>
  );
}

export default Broadcast