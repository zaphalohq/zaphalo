import { useContext, useEffect, useState } from "react"
import { ChatsContext } from "../Context/ChatsContext"
import axios from 'axios'
const MessageDisplay = () => {
  const senderId = import.meta.env.VITE_SENDERID;
  const { chatsDetails }: any = useContext(ChatsContext)
  const [allMessages, setAllMessages] = useState([{
    message: '',
    senderId: {
      id: '',
      phoneNo: ''
    }
  }])
  const FetchMessage = async () => {    
    console.log(chatsDetails.channelId,"................");
    if(chatsDetails.channelId){
    const response = await axios.get("http://localhost:3000/webhook/sendMsg1", {
      params : {
        channelId : chatsDetails.channelId
      }
    })
    setAllMessages(response.data)
    // return response
  }
}
  useEffect(() => {
    FetchMessage()
  }, [chatsDetails.channelId])

  return (
    <div className="relative h-[76vh]">
      {/* opacity of image */}
      <div style={{ backgroundAttachment: "fixed" }} className="absolute inset-0 overflow-y-scroll bg-whatsappImg bg-gray-500 opacity-15 z-0 "></div>
      <div className="relative z-10 h-full overflow-y-scroll p-4"> 
        {allMessages.map((data, index) =>
          <div key={index} className="relative z-10 p-4">
            {/* {data.senderId.id !== senderId ? ( */}
              <div className="text-stone-900 flex justify-start text-lg ">
                <div className="bg-[#ffffff] p-2 rounded">{data.message}</div>
              </div>
            {/* ) : ( */}
              <div className="flex justify-end rounded text-lg">
                <div className="p-2 text-stone-900 bg-[#dbf8c6] rounded">{data.message}</div>
              </div>
            {/* )} */}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageDisplay
