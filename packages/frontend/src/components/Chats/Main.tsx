import ChatsNav from "./ChatsNav"
import MessageArea from "./MessagingArea"
import MessageDisplay from "./MessageDisplay"

const ChatsMain = () => {
  return (
    <div>
      <div className='bg-white'>
          <div className="flex flex-col h-full justify-between">
            <div>
            <ChatsNav />
              <MessageDisplay />
            </div>
          <MessageArea />
          </div>
        </div>
    </div>
  )
}

export default ChatsMain
