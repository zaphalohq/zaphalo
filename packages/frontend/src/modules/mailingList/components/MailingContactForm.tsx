import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@src/components/UI/button";
import { Card, CardContent } from "@src/components/UI/card"
import { Input } from "@src/components/UI/input"
import { FindMalingContactByContactId, SaveMailingContact } from "@src/generated/graphql";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MailingContactForm = ({ onBack, selectedListId, selectedListName, selectedContactId }) => {

    const [contactFormData, setContactFormData] = useState({
        id: '',
        contactName: '',
        contactNo: '',
    });

    const [saveMailingContact] = useMutation(SaveMailingContact, {
        onCompleted: (data) => {
            toast.success(selectedContactId ? 'Contact updated successfully' : 'Contact created successfully');
            onBack();
        },
        onError: (err) => {
            console.log(err)
            toast.error(`${err}`);
        },
    })

    const { data: contactData, loading: contactLoading, error: contactError } = useQuery(FindMalingContactByContactId, {
        variables: { mailingContactId: selectedContactId },
        skip: !selectedContactId,
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (contactData?.findMailingContact) {
            setContactFormData({
                contactName: contactData.findMailingContact.contactName || '',
                contactNo: contactData.findMailingContact.contactNo || '',
            });
        }
    }, [contactData]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!contactFormData.contactName || !contactFormData.contactNo) {
            toast.error('Please fill all required fields before contact creating.');
            return;
        }

        type toSubmitData = {
            [key: string]: any;
        };
        const submitData: toSubmitData = {
            contactName: contactFormData.contactName,
            contactNo: contactFormData.contactNo,
            mailingListId: selectedListId,
            ...(selectedContactId && { id: selectedContactId })
        };

        try {
            await saveMailingContact({
                variables: { saveMailingContact: submitData },
            })
        }
        catch (err) {
            console.log('Error submitting form', err)
        }

    }

    if (contactLoading) return <p>Loading contact data...</p>;
    if (contactError) return <p>Error loading contact: {contactError.message}</p>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardContent className="p-8 space-y-6">

                    <h2 className="text-2xl font-bold text-center">
                        {selectedContactId ? "Update Mailing Contact" : "Create New Mailing Contact"}
                    </h2>

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
                            type="text"
                            placeholder="Phone Number"
                            value={contactFormData.contactNo}
                            onChange={(e) => setContactFormData({ ...contactFormData, contactNo: e.target.value })}
                        />
                        <Input
                            type="text"
                            placeholder="mailing list"
                            value={selectedListName}
                            readOnly
                        />


                        {/* Buttons */}
                        <div className="flex justify-between mt-4">
                            <Button variant="outline" onClick={() => onBack()}>
                                Cancel
                            </Button>

                            <Button type="submit">
                                {selectedContactId ? "Update Contact" : "Create Contact"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default MailingContactForm