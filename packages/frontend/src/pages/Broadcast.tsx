import BroadcastView from '@src/components/Broadcast/BroadcastView'
import SendBroadcast from '@src/components/Broadcast/SendBroadcst'
import SubmitButton from '@src/components/UI/SubmitButton'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'

const Broadcast = () => {
    const [isSendBroadcastVis, setIsSendBroadcastVis] = useState(false);
    const [isTemplateVis, setIsTemplateVis] = useState(false);
    const [isMailingListVis, setIsMailingListVis] = useState(false);
    return (
        <>
            <div className='font-bold text-lg border-gray-300 p-4 border-b'>Broadcast Template</div>
            {(!isSendBroadcastVis && !isTemplateVis && !isMailingListVis) ?
                <div className="grid grid-cols-4 pt-4 px-4 ">
                    <div className="md:col-start-8 md:pb-0 col-start-1 col-end-8 pb-4">
                        <SubmitButton type='button' onClick={() => setIsSendBroadcastVis(true)} title="Broadcast" Icon={FaPlus} />
                    </div>
                </div> :
                <div onClick={() => {
                    if(isSendBroadcastVis) setIsSendBroadcastVis(false)
                    if(isTemplateVis) setIsTemplateVis(false)
                    if(isMailingListVis) setIsMailingListVis(false)
                    }}
                    className='m-6 flex items-center justify-center h-10 w-10 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer text-white text-lg font-bold'>
                    <FiArrowLeft />
                </div>
            }
            {!isSendBroadcastVis ?
                <BroadcastView 
                    isTemplateVis={isTemplateVis}
                    setIsTemplateVis={setIsTemplateVis}
                    isMailingListVis={isMailingListVis}
                    setIsMailingListVis={setIsMailingListVis} />
                :
                <SendBroadcast setIsSendBroadcastVis={setIsSendBroadcastVis} />

            }
        </>
    )
}

export default Broadcast
 