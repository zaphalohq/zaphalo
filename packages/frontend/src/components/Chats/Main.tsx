import ChatsNav from "./CurrentChannel"
import MessageArea from "./MessagingArea"
import MessageDisplay from "./MessageDisplay"
import { useState } from "react"

const ChatsMain = () => {
  const [ msgData, setMsgData ] = useState("")
  return (
    <div>
      <div className='bg-white'>
          <div className="flex flex-col h-full justify-between">
            <div>
            <ChatsNav />
              <MessageDisplay msgData={msgData} setMsgData={setMsgData} />
            </div>
          <MessageArea msgData={msgData} setMsgData={setMsgData} />
          </div>
        </div>
    </div>
  )
}

export default ChatsMain
