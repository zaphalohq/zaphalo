import { FormEvent, useContext, useEffect, useState } from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { useLazyQuery, useMutation } from '@apollo/client'
import CloseButton from '@components/UI/CloseButton'
import InputLabel from '@components/UI/InputLabel'
import SubmitButton from '@components/UI/SubmitButton'
import { GetContactByChannelId, updateChannelNameById } from '@src/generated/graphql'
import { ChatsContext } from '@components/Context/ChatsContext'
import ContactForm from '@src/modules/contact/components/ContactForm'
import CreateUpdateContactDialog from '@components/Chats/CreateUpdateContactDialog'

const UpdateChannelName = () => {
  const { isUpdateChannelName, setIsUpdateChannelName }: any = useContext(ChatsContext)
  const [channelNameChange, setChannelNameChange] = useState("")
  const [UpdateChannel] = useMutation(updateChannelNameById)
  const { chatsDetails }: any = useContext(ChatsContext)
  const [contactId, setContactId] = useState<string | null>(null)

  const[findContactByChannleId]=useLazyQuery(GetContactByChannelId)

  useEffect(() => {
    const fetchContact = async () => {
      if (!chatsDetails || !chatsDetails.chennelMembers?.length) return;

      const channelId = chatsDetails.channelId;
      try {
        const { data } = await findContactByChannleId({ variables: { channelId: channelId } });
        if (data?.findContactByChannleId?.id) {
          setContactId(data.findContactByChannleId.id);
        }
      } catch (err) {
        console.error("Error fetching contact by phone:", err);
      }
    };

    fetchContact();
  }, [chatsDetails]);

  return (
    isUpdateChannelName && contactId ?  (
      <CreateUpdateContactDialog
        open={isUpdateChannelName}
        isNewContact={false}
        contactId={contactId}
        onBack={() => setIsUpdateChannelName(false)}
      />
    ) : null
  )

}
export default UpdateChannelName