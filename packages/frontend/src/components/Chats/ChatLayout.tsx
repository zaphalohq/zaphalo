import MessageArea from "./Messagingbot"
import ChatsNav from "./CurrentChannelNav"
import MessageDisplay from "./MessageDisplay"

const ChatsMain = () => {
  return (

    <main className="relative flex flex-1 flex-col">
      <ChatsNav />
      <MessageDisplay />
      <MessageArea />
    </main>
  )
}

export default ChatsMain