import MessageArea from "./Messagingbot"
import ChatsNav from "./CurrentChannelNav"
import MessageDisplay from "./MessageDisplay"

const ChatsMain = () => {
  return (
    <div className="mt-4">
      <div className='bg-white w-full'>
        <div className="flex flex-col justify-between rounded-tl-2xl  bg-chat">
          <ChatsNav />
          <MessageDisplay />
          <MessageArea />
        </div>
      </div>
    </div>
  )
}

export default ChatsMain