import ChatsNav from "./ChatsNav"
import ChatsBottom from "./ChatsBottom"
import ChatsHero from "./ChatsMain"

const ChatsMain = () => {
  return (
    <div>
      <div className='bg-white'>
          <div className="flex flex-col h-full justify-between">
            <div>
            <ChatsNav />
              <ChatsHero />
            </div>
          <ChatsBottom />
          </div>
        </div>
    </div>
  )
}

export default ChatsMain
