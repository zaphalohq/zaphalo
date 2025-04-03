import ChatsNav from "./CurrentChannelNav"
import MessageArea from "./MessagingArea"
import MessageDisplay from "./MessageDisplay"
import { useState } from "react"

const ChatsMain = () => {
  return (
    <div>
      <div className='bg-white w-[117.5vh]  '>
          <div className="flex flex-col justify-between">
            <div>
            <ChatsNav />
              <MessageDisplay  />
            </div>
          <MessageArea  />
          </div>
        </div>
    </div>
  )
}

export default ChatsMain
