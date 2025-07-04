import React, { FormEvent, useContext, useState } from 'react';
import axios from 'axios';
import { FiPaperclip } from 'react-icons/fi';
import { RiSendPlaneFill } from "react-icons/ri";
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '@src/generated/graphql';
import { ChatsContext } from '@components/Context/ChatsContext';

const MessageArea = () => {
  const { chatsDetails, setMyCurrentMessage }: any = useContext(ChatsContext);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [currentMsg, setCurrentMsg] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<
    { fileUrl: string; fileType: string; fileName: string }[]
  >([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsFileUploaded(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/fileupload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const fileType = file.type.split('/')[0];
        const fileName = file.name;

        setUploadedFiles((prev) => [
          ...prev,
          { fileUrl: response.data, fileType, fileName },
        ]);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      }
    }
  };

const HandleDeleteFile = async (filename: string, index : number) => {
  const updatedFiles = uploadedFiles.filter(file => file.fileName !== filename);
  setUploadedFiles(updatedFiles);  
const deleteFileName = uploadedFiles[index].fileUrl.split('/').pop()
  if (updatedFiles.length === 0) {
    setIsFileUploaded(false);
  }
  try {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${deleteFileName}`);
  } catch (error) {
    console.error('Error deleting file from server:', error);
  }
};

  const SubmitMsg = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentMsg && currentMsg !== '' && uploadedFiles.length === 0){
      setMyCurrentMessage((prev: any) => ({
      message: currentMsg,
      count: prev.count + 1,
      attachmentUrl: '',
    }))
    }

    uploadedFiles.forEach( async(uploadedFile) => {
    await setMyCurrentMessage((prev: any) => ({
      message: currentMsg,
      count: prev.count + 1,
      attachmentUrl: uploadedFile.fileUrl,
    }));
    })

    const variables = {
      input: {
        receiverId: chatsDetails.receiverId,
        textMessage: currentMsg,
        channelName: chatsDetails.channelName,
        channelId: chatsDetails.channelId || '',
        uploadedFiles: uploadedFiles,
      },
    };

    setCurrentMsg('');
    setUploadedFiles([]);
    setIsFileUploaded(false);

    try {
      const response = await sendMessage({ variables });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <form className='bg-white mx-6 mb-6 rounded-2xl' onSubmit={SubmitMsg}>
      <div className="flex items-center justify-between p-6 px-8 relative">
        <button
          type="button"
          className="text-2xl p-2 hover-light rounded cursor-pointer relative"
          onClick={() => document.getElementById('fileInput')?.click()} >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <FiPaperclip />
        </button>

        {isFileUploaded && (
          <div className="flex flex-col absolute bottom-20 gap-2 overflow-y-auto bg-white px-4 z-10 max-h-[400px] pb-4">
            <div className="sticky top-0 bg-white p-4 font-semibold text-center text-lg">
              File Uploaded
            </div>
            {uploadedFiles.map((uploadFile, index) => (
              <div key={index} className="bg-violet-300 p-2 rounded flex justify-between gap-2">
                <span className="truncate w-[80%]">{uploadFile.fileName}</span>
                <button
                  type="button"
                  onClick={() => HandleDeleteFile(uploadFile.fileName, index)}
                  className="text-stone-500 text-lg hover:bg-violet-200 px-2 rounded cursor-pointer"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {isFileUploaded ? (
          <input
            onChange={(e) => setCurrentMsg(e.target.value)}
            className="bg-white w-full mx-4 p-2 border-none outline-none"
            value={currentMsg}
            type="text"
            placeholder="type a message here ..."
          />
        ) : (
          <input
            required
            onChange={(e) => setCurrentMsg(e.target.value)}
            className="bg-white w-full mx-4 p-2 border-none outline-none"
            value={currentMsg}
            type="text"
            placeholder="type a message here ..."
          />
        )}
        <button type="submit" className="text-2xl p-2 rounded hover:bg-violet-700  bg-violet-500 text-white cursor-pointer">
          <RiSendPlaneFill />
        </button>
      </div>
    </form>
  );
};

export default MessageArea;
