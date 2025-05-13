import ChatsNav from "./CurrentChannelNav"
import MessageArea from "./Messagingbot"
import MessageDisplay from "./MessageDisplay"

const ChatsMain = () => {
  // const { messages }: any = useWebSocket()
  // w-[117.5vh]
  return (
    <div>
      <div className='bg-white w-full'>
        <div className="flex flex-col justify-between">
          <ChatsNav />
          <MessageDisplay />
          <MessageArea />
        </div>
      </div>
    </div>
  )
}

export default ChatsMain