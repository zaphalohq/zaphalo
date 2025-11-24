import React, {
  FormEvent,
  useContext,
  useEffect,
  useState,
  ChangeEvent} from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { RiSendPlaneFill } from "react-icons/ri";
import { useMutation } from '@apollo/client';
import {
  CreateOneAttachmentDoc,
  DeleteOneAttachment,
  SEND_MESSAGE,
  FileFolder
} from '@src/generated/graphql';
import { ChatsContext } from '@components/Context/ChatsContext';
import { Post, Delete } from '@src/modules/domain-manager/hooks/axios';
import { getWhatsappMessageType } from './functions/getWhatsappMessageType';
import { toast } from 'react-toastify';
import { isDefined } from '@src/utils/validation/isDefined';
import { useUploadAttachmentFile } from '@src/modules/chat/hooks/useUploadAttachmentFile';
import { cookieStorage } from '@src/utils/cookie-storage';

const MessageArea = () => {
  const { chatsDetails, setMyCurrentMessage }: any = useContext(ChatsContext);
  const [createOneAttachment] = useMutation(CreateOneAttachmentDoc);
  const [deleteOneAttachment] = useMutation(DeleteOneAttachment);
  const { uploadAttachmentFile } = useUploadAttachmentFile();

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [currentMsg, setCurrentMsg] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  type attachmentProp = {
    attachmentId: string,
    attachmentName: string,
    originalname: string,
    messageType: string
  }
  const [attachments, setAttachments] = useState<attachmentProp[]>([]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isDefined(e.target.files)) onUploadFile?.(e.target.files[0]);
  };

  const onUploadFile = async (file: File) => {
    const mimeType = file.type;
    const messageType = getWhatsappMessageType(mimeType);
    if (!messageType) {
      toast.error(`❌ Unsupported file type: ${mimeType}`);
      toast.info(
        <div>
          📄 <strong>Supported types:</strong>
          <ul style={{ margin: '8px 0' }}>
            <li>🖼️ <strong>Images:</strong> JPEG, PNG, WEBP</li>
            <li>🎞️ <strong>Videos:</strong> MP4, 3GPP</li>
            <li>🎧 <strong>Audio:</strong> MP3, OGG, AAC</li>
            <li>📄 <strong>Docs:</strong> PDF, DOCX, XLSX</li>
          </ul>
        </div>);
      return;
    }
    const attachment = await uploadAttachmentFile(file);
    const attachmentVal = {
      attachmentId: attachment?.data?.CreateOneAttachment?.id,
      attachmentName: attachment?.data?.CreateOneAttachment?.name,
      originalname: attachment?.data?.CreateOneAttachment?.originalname,
      messageType
    }
    setIsFileUploaded(true);

    await setAttachments((prev) => [
      ...(prev ?? []),
      attachmentVal,
    ]);
  };

  const HandleDeleteFile = async (attachmentId: string, index: number) => {
    attachments.splice(index, 1);
    console.log(attachments, 'attachmentattachmentattachment');

    setAttachments(attachments)
    if (attachments.length === 0) {
      setIsFileUploaded(false);
    }
    try {
      const deletedAttachement = await deleteOneAttachment({
        variables: {
          attachmentId
        }
      })
    } catch (error) {
      console.error('Error deleting file from server:', error);
    }
  };

  const SubmitMsg = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const variablesAttachments = attachments.map((attachment) => {
      return {
        attachmentId: attachment.attachmentId,
        messageType: attachment.messageType
      }
    })

    const variables = {
      sendMessageInput: {
        whatsappAccountId: cookieStorage.getItem('waid'),
        receiverId: chatsDetails.receiverId,
        textMessage: currentMsg,
        channelName: chatsDetails.channelName,
        channelId: chatsDetails.channelId || '',
        attachments: variablesAttachments
      },
    };

    setCurrentMsg('');
    setAttachments([]);
    setIsFileUploaded(false);
    try {
      const response = await sendMessage({ variables });
      setMyCurrentMessage(response.data.sendMessage)
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div>
      <div className="mx-auto flex items-end gap-3">
        <div className="flex-1">
          {chatsDetails.channelId ?
            <form className='bg-white mx-6 mb-6 rounded-2xl' onSubmit={SubmitMsg}>
              <div className="flex items-center justify-between p-6 px-8 relative">
                <button
                  type="button"
                  className="mt-2 px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => document.getElementById('fileInput')?.click()} >
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                  📎
                </button>

                {isFileUploaded && (
                  <div className="flex flex-col absolute bottom-20 gap-2 overflow-y-auto bg-white px-4 z-10 max-h-[400px] pb-4">
                    <div className="sticky top-0 bg-white p-4 font-semibold text-center text-lg">
                      File Uploaded
                    </div>
                    {attachments.map((attachment, index) => (
                      <div key={index} className="bg-violet-300 p-2 rounded flex justify-between gap-2">
                        <span className="truncate w-[80%]">
                          {attachment.originalname}</span>
                        <button
                          type="button"
                          onClick={() => HandleDeleteFile(attachment.attachmentId, index)}
                          className="text-stone-500 text-lg hover:bg-violet-200 px-2 rounded cursor-pointer"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {isFileUploaded ? (
                  <textarea
                    rows={1}
                    value={currentMsg}
                    onChange={(e) => setCurrentMsg(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full px-3 py-2 border rounded-md resize-none"
                  />

                ) : (
                  <textarea
                    required
                    rows={1}
                     value={currentMsg}
                    onChange={(e) => setCurrentMsg(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full px-3 py-2 border rounded-md resize-none"
                  />
                )}
                <div className="flex flex-col items-center mx-4">
                  <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:opacity-95">
                    Send
                  </button>
                </div>
              </div>
            </form>
            :
            <div className="bg-chat p-10 h-full w-full text-lg text-center font-semibold text-gray-500">
              Select channel or contact for chat.
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MessageArea;
