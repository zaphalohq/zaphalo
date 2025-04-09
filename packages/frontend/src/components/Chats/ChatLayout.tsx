import ChatsNav from "./CurrentChannelNav"
import MessageArea from "./Messagingbot"
import MessageDisplay from "./MessageDisplay"

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
