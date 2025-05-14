// // import { useContext, useEffect, useRef, useState } from "react"
// // import { ChatsContext } from "../Context/ChatsContext"
// // import { getItem, setItem } from "../utils/localStorage";
// // import { useQuery } from "@apollo/client";
// // import { findMsgByChannelId } from "../../pages/Mutation/Chats";
// // import { useWebSocket } from "./hooks/WebSocket";

// // const MessageDisplay = () => {
//   // const senderPhoneNo = import.meta.env.VITE_SENDER_PHONENO;
//   // const { myCurrentMessage }: any = useContext(ChatsContext)
//   // const { chatsDetails }: any = useContext(ChatsContext)
//   // const [allMessages, setAllMessages] = useState([{
//   //   message: '',
//   //   sender: {
//   //     id: '',
//   //     phoneNo: ''
//   //   },
//   //   createdAt: '',
//   //   attachment: '',
//   // }])

//   // //-----------------Mutation of finding all messages of current channel-------------
//   // const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
//   //   variables: { channelId: chatsDetails?.channelId },
//   //   skip: chatsDetails.channelId == '',
//   // })


//   // //--------------------Fetch messages-------------------------------
//   // const FetchMessage = async () => {
//   //   if (chatsDetails.channelId !== '') {
//   //     await refetch(); // Ensure latest data is fetched

//   //     if (data?.findMsgByChannelId) {
//   //       setAllMessages(data.findMsgByChannelId);
//   //     } else {
//   //       console.log('No messages found or still loading.');
//   //       setAllMessages([]);
//   //     }

//   //     // Auto-scroll to latest message
//   //     if (makeScroll.current)
//   //       makeScroll.current.scrollIntoView({ behavior: 'smooth' });
//   //   } else {
//   //     setAllMessages([{
//   //       message: '',
//   //       sender: {
//   //         id: '',
//   //         phoneNo: ''
//   //       },
//   //       createdAt: '',
//   //       attachment: '',
//   //     }])
//   //   }
//   // };

//   // //----------Trigger fetching messages when data is updated---------------------
//   // useEffect(() => {
//   //   // console.log(chatsDetails,"thisis form messages ..........................");
    
//   //   if (!loading && data) {
//   //     FetchMessage();
//   //   }
//   // }, [data, loading, chatsDetails]);

//   // useEffect(() => {
//   //   if (chatsDetails.channelId == '')
//   //     setAllMessages([{
//   //       message: '',
//   //       sender: {
//   //         id: '',
//   //         phoneNo: ''
//   //       },
//   //       createdAt: '',
//   //       attachment: '',
//   //     }])
//   // }, [chatsDetails.channelId])

// //   //-------------------Make a scroll after all messages are displayed------------
// //   const makeScroll = useRef<HTMLDivElement>(null);
// //   useEffect(() => {
// //     if (makeScroll.current) makeScroll.current.scrollIntoView({ behavior: 'instant' })
// //   }, [allMessages]);

//   // const { messages }: any = useWebSocket()

//   // //---------------when i messages it push my message to array and display---------
//   // useEffect(() => {
//   //   setAllMessages((prev) => [
//   //     ...prev,
//   //     {
//   //       message: myCurrentMessage.message,
//   //       sender: {
//   //         id: '',
//   //         phoneNo: senderPhoneNo
//   //       },
//   //       createdAt: '',
//   //       attachment: myCurrentMessage.attachmentUrl,
//   //     }])
//   // }, [myCurrentMessage])

//   // //---------------When new message comes from websocket it handles it------------------- 
//   // const { newMessage, setNewMessage }: any = useContext(ChatsContext)
//   // useEffect(() => {    
//   //   console.log(JSON.stringify(newMessage),".........................new mdmdmd..............");
//   //   if(!newMessage) return
//   //   if ( newMessage != undefined) {
//   //     const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
//   //     const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);

 
//   //     if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") { // Check if channel exists
//   //       // Build the new messages array once
//   //       const newMessages = currentChannel.message.map((message: any) => ({
//   //         message: message,
//   //         sender: {
//   //           id: "",
//   //           phoneNo: currentChannel.phoneNo,
//   //         },
//   //       }));
//   //       setAllMessages((prev) => [...prev, ...newMessages]); // Add all at once

//   //       // Remove the channel from newMessage and update storage
//   //       newMessage.splice(currentChannelIndex, 1);

//   //       setNewMessage(newMessage)
//   //       setItem("messages", newMessage); // Save the updated array
//   //     }
//   //   }
//   // }, [newMessage]);

//   // //-----------------It handle the the date displayed with message---------
//   // const HandleCurrentDate = (createdAt: any) => {
//   //   const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
//   //     hour: '2-digit',
//   //     minute: '2-digit',
//   //     hour12: true
//   //   })
//   //   return currentDate
//   // }


// //   return (
// //     <div className="relative h-[75vh]">
// //       {/* opacity of image */}
// //       <div style={{ backgroundAttachment: "fixed" }} className="absolute inset-0 overflow-y-scroll bg-whatsappImg bg-gray-500 opacity-15 z-0 "></div>
// //       <div className="relative z-10 h-full overflow-y-scroll p-4">
// //         {/* <button onClick={BUTTON}>BUTTON</button> */}
// //         {allMessages.map((message, index) =>
// //           <div key={index} className="relative z-10 p-4">
// //             {message.sender.phoneNo != senderPhoneNo ? (
// //               <div className="text-stone-900 flex justify-start text-lg ">
// //                 <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[40%]">
// //                   <div className="break-words">{message.message}</div>
// //                   {message.message ? (
// //                     <div className="text-xs flex text-gray-500">
// //                       {HandleCurrentDate(message.createdAt)}
// //                     </div>
// //                   ) : null}
// //                 </div>
// //               </div>
// //             ) : (
// //               <div className="flex justify-end rounded text-lg">
// //                 <div className=" bg-[#dbf8c6] p-2 rounded-lg flex flex-col gap-1 max-w-[40%]">
// //                   {message.attachment ? <div>
// //                     <iframe
// //                       src={message.attachment}
// //                       width="200"
// //                       height="200"
// //                       className="border-none"
// //                     />
// //                     <div onClick={() => window.open(message.attachment)}
// //                       className="hover:cursor-pointer text-blue-700" >{message.attachment.split('-').pop()}
// //                     </div>
// //                   </div>
// //                     : <></>}
// //                   <div className="break-words">{message.message}</div>
// //                   {message.message ? (
// //                     <div className="text-xs text-gray-500 self-end">
// //                       {HandleCurrentDate(message.createdAt)}
// //                     </div>
// //                   ) : null}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //         {/* makeing is autoscrollable */}
// //         <div ref={makeScroll}></div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default MessageDisplay




// import { useContext, useEffect, useRef, useState } from "react";
// import { ChatsContext } from "../Context/ChatsContext";
// import { getItem, setItem } from "../utils/localStorage";
// import { useQuery } from "@apollo/client";
// import { findMsgByChannelId } from "../../pages/Mutation/Chats";
// import { useWebSocket } from "./hooks/WebSocket";

// const MessageDisplay = () => {
//   const senderPhoneNo = import.meta.env.VITE_SENDER_PHONENO;
//   const { myCurrentMessage }: any = useContext(ChatsContext)
//   const { chatsDetails }: any = useContext(ChatsContext)
//   const [allMessages, setAllMessages] = useState([{
//     message: '',
//     sender: {
//       id: '',
//       phoneNo: ''
//     },
//     createdAt: '',
//     attachment: '',
//   }])

//   //-----------------Mutation of finding all messages of current channel-------------
//   const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
//     variables: { channelId: chatsDetails?.channelId },
//     skip: chatsDetails.channelId == '',
//   })


//   //--------------------Fetch messages-------------------------------
//   const FetchMessage = async () => {
//     if (chatsDetails.channelId !== '') {
//       await refetch(); // Ensure latest data is fetched

//       if (data?.findMsgByChannelId) {
//         setAllMessages(data.findMsgByChannelId);
//       } else {
//         console.log('No messages found or still loading.');
//         setAllMessages([]);
//       }

//       // Auto-scroll to latest message
//       // if (makeScroll.current)
//       //   makeScroll.current.scrollIntoView({ behavior: 'smooth' });
//     } else {
//       setAllMessages([{
//         message: '',
//         sender: {
//           id: '',
//           phoneNo: ''
//         },
//         createdAt: '',
//         attachment: '',
//       }])
//     }
//   };

//   //----------Trigger fetching messages when data is updated---------------------
//   useEffect(() => {
//     // console.log(chatsDetails,"thisis form messages ..........................");
    
//     if (!loading && data) {
//       FetchMessage();
//     }
//   }, [data, loading, chatsDetails]);

//   useEffect(() => {
//     if (chatsDetails.channelId == '')
//       setAllMessages([{
//         message: '',
//         sender: {
//           id: '',
//           phoneNo: ''
//         },
//         createdAt: '',
//         attachment: '',
//       }])
//   }, [chatsDetails.channelId])


//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
//     }
//   }, [allMessages]);

//   const { messages }: any = useWebSocket()

//   //---------------when i messages it push my message to array and display---------
//   useEffect(() => {
//     setAllMessages((prev) => [
//       ...prev,
//       {
//         message: myCurrentMessage.message,
//         sender: {
//           id: '',
//           phoneNo: senderPhoneNo
//         },
//         createdAt: '',
//         attachment: myCurrentMessage.attachmentUrl,
//       }])
//   }, [myCurrentMessage])

//   //---------------When new message comes from websocket it handles it------------------- 
//   const { newMessage, setNewMessage }: any = useContext(ChatsContext)
//   useEffect(() => {    
//     console.log(JSON.stringify(newMessage),".........................new mdmdmd..............");
//     if(!newMessage) return
//     if ( newMessage != undefined) {
//       const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
//       const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);

 
//       if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") { // Check if channel exists
//         // Build the new messages array once
//         const newMessages = currentChannel.message.map((message: any) => ({
//           message: message,
//           sender: {
//             id: "",
//             phoneNo: currentChannel.phoneNo,
//           },
//         }));
//         setAllMessages((prev) => [...prev, ...newMessages]); // Add all at once

//         // Remove the channel from newMessage and update storage
//         newMessage.splice(currentChannelIndex, 1);

//         setNewMessage(newMessage)
//         setItem("messages", newMessage); // Save the updated array
//       }
//     }
//   }, [newMessage]);

//   //-----------------It handle the the date displayed with message---------
//   const HandleCurrentDate = (createdAt: any) => {
//     const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     })
//     return currentDate
//   }
//   return (
//     <div className="relative flex h-full overflow-y-scroll max-w-[100vh]">
//       {/* Background image */}
//       <div
//         style={{ backgroundAttachment: "fixed" }}
//         className="absolute inset-0 bg-whatsappImg bg-gray-500 opacity-15 z-0"
//       ></div>
//       {/* Scrollable messages container */}
//       <div
//         ref={messagesContainerRef}
//         className="relative z-10 w-full h-full overflow-y-auto p-3 sm:p-4"
//       >
//         {allMessages.map((message, index) => (
//           <div key={index} className="relative z-10 p-3 sm:p-4">
//             {message.sender.phoneNo !== senderPhoneNo ? (
//               <div className="text-stone-900 flex justify-start text-base sm:text-lg">
//                 <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-full">
//                   <div className="break-words">{message.message}</div>
//                   {message.message ? (
//                     <div className="text-xs text-gray-500">
//                       {HandleCurrentDate(message.createdAt)}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             ) : (
//               <div className="flex justify-end text-base sm:text-lg">
//                 <div className="bg-[#dbf8c6] p-2 rounded-lg flex flex-col gap-1 max-w-full">
//                   {message.attachment ? (
//                     <div>
//                       <iframe
//                         src={message.attachment}
//                         width="100%"
//                         height="200"
//                         className="border-none max-w-full"
//                       />
//                       <div
//                         onClick={() => window.open(message.attachment)}
//                         className="hover:cursor-pointer text-blue-700 text-sm"
//                       >
//                         {message.attachment.split("-").pop()}
//                       </div>
//                     </div>
//                   ) : null}
//                   <div className="break-words">{message.message}</div>
//                   {message.message ? (
//                     <div className="text-xs text-gray-500 self-end">
//                       {HandleCurrentDate(message.createdAt)}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MessageDisplay;




import { useContext, useEffect, useRef, useState } from "react"
import { ChatsContext } from "@Context/ChatsContext"
import { getItem, setItem } from "@utils/localStorage";
import { useQuery } from "@apollo/client";
import { findMsgByChannelId } from "@pages/Mutation/Chats";
import { useWebSocket } from "./Websocket_hooks/WebSocket";

const MessageDisplay = () => {
  const senderPhoneNo = import.meta.env.VITE_SENDER_PHONENO;
  const { myCurrentMessage }: any = useContext(ChatsContext)
  const { chatsDetails }: any = useContext(ChatsContext)
  const [allMessages, setAllMessages] = useState([{
    message: '',
    sender: {
      id: '',
      phoneNo: ''
    },
    createdAt: '',
    attachment: '',
  }])

  //-----------------Mutation of finding all messages of current channel-------------
  const { data, loading, error, refetch } = useQuery(findMsgByChannelId, {
    variables: { channelId: chatsDetails?.channelId },
    skip: chatsDetails.channelId == '',
  })


  //--------------------Fetch messages-------------------------------
  const FetchMessage = async () => {
    if (chatsDetails.channelId !== '') {
      // await ref  etch(); // Ensure latest data is fetched

      if (data?.findMsgByChannelId) {
        setAllMessages(data.findMsgByChannelId);
      } else {
        console.log('No messages found or still loading.');
        setAllMessages([]);
      }

      // Auto-scroll to latest message
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    } else {
      setAllMessages([{
        message: '',
        sender: {
          id: '',
          phoneNo: ''
        },
        createdAt: '',
        attachment: '',
      }])
    }
  };

  //----------Trigger fetching messages when data is updated---------------------
  useEffect(() => {
    // console.log(chatsDetails,"thisis form messages ..........................");
    
    if (!loading && data) {
      FetchMessage();
    }
  }, [data, loading, chatsDetails]);

  useEffect(() => {
    if (chatsDetails.channelId == '')
      setAllMessages([{
        message: '',
        sender: {
          id: '',
          phoneNo: ''
        },
        createdAt: '',
        attachment: '',
      }])
  }, [chatsDetails.channelId])


  const { messages }: any = useWebSocket()

  //---------------when i messages it push my message to array and display---------
  useEffect(() => {
    setAllMessages((prev) => [
      ...prev,
      {
        message: myCurrentMessage.message,
        sender: {
          id: '',
          phoneNo: senderPhoneNo
        },
        createdAt: '',
        attachment: myCurrentMessage.attachmentUrl,
      }])
  }, [myCurrentMessage])

  //---------------When new message comes from websocket it handles it------------------- 
  const { newMessage, setNewMessage }: any = useContext(ChatsContext)
  useEffect(() => {    
    console.log(JSON.stringify(newMessage),".........................new mdmdmd..............");
    if(!newMessage) return
    if ( newMessage != undefined) {
      const currentChannel = newMessage.find((message: any) => message.channelId === chatsDetails.channelId) || null;
      const currentChannelIndex = newMessage.findIndex((message: any) => message.channelId === chatsDetails.channelId);

 
      if (currentChannel && JSON.parse(JSON.stringify(currentChannel)).channelId != "") { // Check if channel exists
        // Build the new messages array once
        const newMessages = currentChannel.message.map((message: any) => ({
          message: message,
          sender: {
            id: "",
            phoneNo: currentChannel.phoneNo,
          },
        }));
        setAllMessages((prev) => [...prev, ...newMessages]); // Add all at once

        // Remove the channel from newMessage and update storage
        newMessage.splice(currentChannelIndex, 1);

        setNewMessage(newMessage)
        setItem("messages", newMessage); // Save the updated array
      }
    }
  }, [newMessage]);

  //-----------------It handle the the date displayed with message---------
  const HandleCurrentDate = (createdAt: any) => {
    const currentDate = new Date(createdAt ? createdAt : Date.now()).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    return currentDate
  }

    const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <div className="relative h-[75vh]">
      {/* opacity of image */}
      <div style={{ backgroundAttachment: "fixed" }} className="absolute inset-0 overflow-y-scroll bg-whatsappImg bg-gray-500 opacity-15 z-0 "></div>
      <div ref={messagesContainerRef} className="relative z-10 h-full overflow-y-scroll p-4">
        {/* <button onClick={BUTTON}>BUTTON</button> */}
        {allMessages.map((message, index) =>
          <div key={index} className="relative z-10 p-4">
            {message.sender.phoneNo != senderPhoneNo ? (
              <div className="text-stone-900 flex justify-start text-lg ">
                <div className="bg-[#ffffff] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                  <div className="break-words">{message.message}</div>
                  {message.message ? (
                    <div className="text-xs flex text-gray-500">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex justify-end rounded text-lg">
                <div className=" bg-[#dbf8c6] p-2 rounded-lg flex flex-col gap-1 max-w-[70%] md:max-w-[40%]">
                  {message.attachment ? <div>
                    <iframe
                      src={message.attachment}
                      width="200"
                      height="200"
                      className="border-none"
                    />
                    <div onClick={() => window.open(message.attachment)}
                      className="hover:cursor-pointer text-blue-700" >{message.attachment.split('-').pop()}
                    </div>
                  </div>
                    : <></>}
                  <div className="break-words">{message.message}</div>
                  {message.message ? (
                    <div className="text-xs text-gray-500 self-end">
                      {HandleCurrentDate(message.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default MessageDisplay