import { useContext, useState } from 'react';
import InputLabel from '@components/UI/InputLabel';
import SubmitButton from '@components/UI/SubmitButton';
import CloseButton from '@components/UI/CloseButton';
import { ContactsContext } from '@components/Context/ContactsContext';
import { Post } from '@src/modules/domain-manager/hooks/axios';
import { Button } from '@src/components/UI/button';
import { Input } from '@src/components/UI/input';
import { Card, CardContent } from '@src/components/UI/card';
import { on } from 'events';
import { useMutation, useQuery } from '@apollo/client';
import { CreateContactMute, GetContactById, UpdateContactMute } from '@src/generated/graphql';
import { isDefined } from '@src/utils/validation/isDefined';
import { toast } from 'react-toastify';

const ContactForm = ({contactId,onBack,isNewContacts }) => {

  const [contactFormData, setContactFormData] = useState({
    contactId: '',
    contactName: '',
    phoneNo: '',
    profileImg: '',
    address: '',
  });

  if (isDefined(contactId)){
    const { data : contactViewData, loading: viewLoading, error: viewError } = useQuery(GetContactById, {
      variables: { contactId: contactId },
      fetchPolicy: "cache-and-network",
    })
    const contactView = contactViewData?.getContactById;
    if (contactView && !contactFormData.contactName){
      setContactFormData({
        contactId: contactView.id,
        contactName: contactView.contactName,
        phoneNo: contactView.phoneNo,
        profileImg: contactView.profileImg,
        address: contactView.address,
      })
    }
  }



  const [fileError, setFileError] = useState('');


  const HandleUploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeInMb = file.size / (1024 * 1024);
      if (fileSizeInMb > 2) {
        setFileError('Upload file size of 2mb');
        return;
      }
      setFileError('');
      const formData = new FormData();

      formData.append('file', file);
      const response = await Post(`/fileupload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response && response.data) {
        setContactFormData({
          ...contactFormData,
          profileImg: response.data,
        });
      }
    }
  };

  const [CreateContact] = useMutation(CreateContactMute,{
    onCompleted: (data) => {
      toast.success('Contact created successfully');
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });
  const [UpdateContact] = useMutation(UpdateContactMute);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here

    if (!contactFormData.contactName || !contactFormData.phoneNo) {
      toast.error('Please fill all required fields before contact creating.');
      return;
    }
    type toSubmitData = {
      [key: string]: any;
    };
    const submitData: toSubmitData = {
      contactName: contactFormData.contactName,
      phoneNo: Number(contactFormData.phoneNo), // Convert to number
      profileImg: contactFormData.profileImg,
      address: contactFormData.address,
    };
    if (isNewContacts) {
      try {
        await CreateContact({
          variables: { CreateContacts: submitData },
        })
        onBack()
      } catch (err) {
        console.error('Error submitting form', err);
      }

    }
    else {
      try {
        await UpdateContact({
          variables: {
            UpdateContact: contactFormData
          }
        })
        onBack();
      } catch (err) {
        console.error('Error during updating', err)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8 space-y-6">

          <h2 className="text-2xl font-bold text-center">Create New Contact</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Name */}
            <Input
              type="text"
              placeholder="Contact Name"
              value={contactFormData.contactName}
              onChange={(e) => setContactFormData({ ...contactFormData, contactName: e.target.value })}
            />

            {/* Phone Number */}
            <Input
              type="number"
              placeholder="Phone Number"
              value={contactFormData.phoneNo}
              onChange={(e) => setContactFormData({ ...contactFormData, phoneNo: e.target.value })}
            />

            {/* Address */}
            <Input
              type="text"
              placeholder="Address"
              value={contactFormData.address}
              onChange={(e) => setContactFormData({ ...contactFormData, address: e.target.value })}
            />

            {/* Upload Image */}
            <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
              <Input
                type="file"
                accept="image/*"
                id="file_input"
                onChange={HandleUploadImg}
              />
            </div>

            {fileError && <p className="text-red-500">{fileError}</p>}

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>

              {isNewContacts ? (
                <Button type="submit">Create Contact</Button>
              ) : (
                <Button type="submit">Update Contact</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
