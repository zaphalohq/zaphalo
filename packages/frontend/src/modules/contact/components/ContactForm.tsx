import { useContext, useEffect, useState } from 'react';
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
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { CitySelect, CountrySelect, GetCountries, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";


const ContactForm = ({ contactId, onBack, isNewContacts }) => {

  const [countryObj, setCountryObj] = useState(null)

  const [contactFormData, setContactFormData] = useState({
    id: '',
    contactName: '',
    phoneNo: '',
    profileImg: '',
    street: '',
    city: '',
    country: '',
    state: '',
    zipcode: ''
  });


  // to get data while updating
  const { data: contactViewData } = useQuery(GetContactById, {
    variables: { contactId },
    skip: !isDefined(contactId),
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const fetchAndSetContact = async () => {
      if (contactViewData?.getContactById && !contactFormData.contactName) {
        const contactView = contactViewData.getContactById;

        setContactFormData({
          id: contactView.id,
          contactName: contactView.contactName,
          phoneNo: contactView.phoneNo,
          profileImg: contactView.profileImg,
          street: contactView.street,
          city: contactView.city,
          country: contactView.country,
          state: contactView.state,
          zipcode: contactView.zipcode,
        });

        const countries = await GetCountries()
        const country = countries.find((e) => e.name === contactView.country)
        setCountryObj(country)
      }
    };

    fetchAndSetContact();
  }, [contactViewData]);

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
      const response = await Post(`/upload`, formData, {
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

  const [CreateContact] = useMutation(CreateContactMute, {
    onCompleted: (data) => {
      toast.success('Contact created successfully');
    },
    onError: (err) => {
      console.log(err)
      toast.error(`${err}`);
    },
  });
  const [UpdateContact] = useMutation(UpdateContactMute, {
    onCompleted: (data) => {
      toast.success('Contact updated successfully');
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });

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
      phoneNo: contactFormData.phoneNo, // Convert to number
      profileImg: contactFormData.profileImg,
      street: contactFormData.street || '',
      country: contactFormData.country || '',
      state: contactFormData.state || '',
      city: contactFormData.city || '',
      zipcode: contactFormData.zipcode || '',
    };

    console.log(submitData)
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
        console.log(contactFormData)
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

          <h2 className="text-2xl font-bold text-center">
            {isNewContacts ? "Create New Contact" : "Update Contact"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Name */}
            <Input
              type="text"
              placeholder="Contact Name"
              value={contactFormData.contactName}
              onChange={(e) => setContactFormData({ ...contactFormData, contactName: e.target.value })}
            />

            <PhoneInput
              forceDialCode={true}
              defaultCountry="ua"
              value={contactFormData.phoneNo}
              onChange={(phone) => setContactFormData({ ...contactFormData, phoneNo: phone })}
              containerClassName="!w-full !flex !items-center !rounded-lg !border !border-gray-300 transition-all"
              inputClassName="!flex-1 !border !border-gray-300 !rounded-lg !px-3 !py-2 !text-gray-700 focus:!border-gray-500 focus:!ring-1 focus:!ring-gray-400 focus:!outline-none"
              countrySelectorStyleProps={{
                buttonStyle: {
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  padding: '0 10px',
                  marginRight: '8px', // gap between flag & number input
                },
              }}
            />

            {/* addreess */}
            <Input
              type="text"
              placeholder="Street"
              value={contactFormData.street}
              onChange={(e) => setContactFormData({
                ...contactFormData,
                street: e.target.value
              })}
            />
            <Input
              type="text"
              placeholder="City"
              value={contactFormData.city}
              onChange={(e) => setContactFormData({
                ...contactFormData,
                city: e.target.value
              })}
            />
            <CountrySelect
              defaultValue={countryObj?.id}
              containerClassName=""
              inputClassName="!w-full !border !border-gray-300 !rounded-lg border-none"
              onChange={(_country) => {
                setCountryObj(_country); // ✅ update the selected country object
                setContactFormData({ ...contactFormData, country: _country?.name });
              }}
              placeHolder="Select Country"
            showFlag={false}
            />
            <StateSelect
              key={countryObj?.id}
              countryid={countryObj?.id}
              inputClassName="!w-full !border !border-gray-300 !rounded-lg border-none"
              defaultValue={contactFormData.state}
              onChange={(_state) => {
                setContactFormData({ ...contactFormData, state: _state?.name });
              }}
              placeHolder="Select State"
            />
            <Input
              type="text"
              placeholder="Zipcode"
              value={contactFormData.zipcode}
              maxLength={6}
              onChange={(e) => setContactFormData({
                ...contactFormData,
                zipcode: e.target.value
              })}
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
    </div >
  );
};

export default ContactForm;
