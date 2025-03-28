import ChatsNav from "./CurrentChannelNav"
import MessageArea from "./MessagingArea"
import MessageDisplay from "./MessageDisplay"
import { useState } from "react"

const ChatsMain = () => {
  const [ myMessage, setMyMessage ] = useState("")
  return (
    <div>
      <div className='bg-white'>
          <div className="flex flex-col h-full justify-between">
            <div>
            <ChatsNav />
              <MessageDisplay myMessage={myMessage} />
            </div>
          <MessageArea setMyMessage={setMyMessage} />
          </div>
        </div>
    </div>
  )
}

export default ChatsMain
