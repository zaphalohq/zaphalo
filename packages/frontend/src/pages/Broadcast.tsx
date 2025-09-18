import BroadcastView from '@src/components/Broadcast/BroadcastView'
import SendBroadcast from '@src/components/Broadcast/SendBroadcst'
import SubmitButton from '@src/components/UI/SubmitButton'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

import BroadcastList from "@src/modules/broadcast/components/BroadcastList";
import BroadcastForm from "@src/modules/broadcast/components/BroadcastForm";

const Broadcast = () => {
  const [isSendBroadcastVis, setIsSendBroadcastVis] = useState(false);
  const [isMailingListVis, setIsMailingListVis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [broadcast, setBroadcast] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      {showForm ? (
        <BroadcastForm broadcastId={broadcast} readOnly={readOnly} onBack={() => setShowForm(false)} />
      ) : (
        <BroadcastList
          showForm={setShowForm}
          setReadOnly={setReadOnly}
          setBroadcast={setBroadcast}
          onCreate={() => {
            setBroadcast(false)
            setReadOnly(false)
            setShowForm(true)
          }} />
      )}
    </div>
  );
}

export default Broadcast