import MessageArea from "./Messagingbot"
import ChatsNav from "./CurrentChannelNav"
import MessageDisplay from "./MessageDisplay"

const ChatsMain = () => {
  return (

    <main className="flex-1 flex flex-col">
      <ChatsNav />
      <MessageDisplay />
      <MessageArea />
    </main>
  )
}

export default ChatsMain