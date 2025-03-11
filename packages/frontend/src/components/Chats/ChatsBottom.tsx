import { useContext, useState } from 'react'
import { FiPaperclip } from 'react-icons/fi'
import { IoSendSharp } from 'react-icons/io5'
import axios from 'axios'
import { ChatsContext } from '../Context/ChatsContext'
const ChatsBottom = () => {
  const { chatDetails } : any = useContext(ChatsContext)
  const [ msgData, setMsgData ] = useState("")
  const SubmitMsg = async () => {    

    // const response = await axios.post(
    //   'http://localhost:3000/webhook/sendMsg',
      // {
      //   senderId: 565830889949112,
      //   receiverId: 917202031718,
      //   msg: msgData,
      //   channelName: "BanasTech"
      // },
    //   {
    //     headers: {
    //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoaW50YW4iLCJzdWIiOiI0ODhkZmIzMy01NzU2LTRiYWUtYmYyMy0zNGU4ZjgxZjY4ZWMiLCJpYXQiOjE3NDE1ODAwMTAsImV4cCI6MTc0MTU4MzYxMH0.9HU4uT3msySCVV0eSnD1lis0pTA6LFJ41eqatzvEexI',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );

    // console.log(response.data)



    const response = await axios({
      url: 'http://localhost:3000/webhook/sendMsg',
      method: 'POST',
      headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoaW50YW4iLCJzdWIiOiI0ODhkZmIzMy01NzU2LTRiYWUtYmYyMy0zNGU4ZjgxZjY4ZWMiLCJpYXQiOjE3NDE1ODAwMTAsImV4cCI6MTc0MTU4MzYxMH0.9HU4uT3msySCVV0eSnD1lis0pTA6LFJ41eqatzvEexI`,
          'Content-Type': 'application/json',
          'accept': 'pplication/json',
      },
      data: JSON.stringify({
        senderId: 565830889949112,
        receiverId: 917202031718,
        msg: msgData,
        channelName: "BanasTech"
      })
  })
  console.log(response);
    
  }
  return (
    <div className="flex items-center justify-between bg-stone-200 p-6 px-8">
    <button className="text-2xl p-2 hover:bg-stone-300 cursor-pointer"><FiPaperclip /></button>
    <input onChange={(e) => setMsgData(e.target.value)} className="bg-white w-full mx-4 p-2 border-none outline-none" type="text" placeholder="type a message here ..." />
    <button onClick={SubmitMsg} className="text-2xl p-2 hover:bg-stone-300 cursor-pointer"><IoSendSharp /></button>
  </div>
  )
}

export default ChatsBottom
