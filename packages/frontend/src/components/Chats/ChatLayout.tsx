import ChatsNav from "./CurrentChannelNav"
import MessageArea from "./Messagingbot"
import MessageDisplay from "./MessageDisplay"
import { useWebSocket } from "./hooks/WebSocket"

const ChatsMain = () => {
  // const { messages }: any = useWebSocket()
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
