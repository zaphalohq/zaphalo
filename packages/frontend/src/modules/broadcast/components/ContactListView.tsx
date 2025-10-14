import { useQuery } from '@apollo/client'
import { Button } from '@src/components/UI/button'
import { Card, CardContent } from '@src/components/UI/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/UI/table'
import { GetContactList } from '@src/generated/graphql'
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader'
import React, { useEffect, useState } from 'react'

const ContactListView = ({ contactListId, onBack }) => {

    const [loading, setLoading] = useState(false);

    const { data: contactData, loading: loadingData, error, refetch } = useQuery(GetContactList, {
        variables: { contactListId: contactListId },
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await refetch();
            setLoading(false);
        };
        fetchData();
    }, [])

    const mailingList = contactData?.getContactList?.contactList;
    const contacts = mailingList?.mailingContacts || [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <PageHeader title="Contact List"
                    className="w-full"
                    actions={
                        <>
                            <Button
                                onClick={() => onBack()}
                            >
                                Back To BroadCast
                            </Button>
                        </>
                    } />
            </div>
            {/* {mailingList && (
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">List Name</p>
                                <p className="font-semibold">{mailingList.mailingListName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Contacts</p>
                                <p className="font-semibold">{mailingList.totalContacts}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )} */}
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
                        <TableHeader className="text-black">
                            <TableRow className="bg-gray-100 uppercase text-sm font-semibold">
                                <TableHead className="px-4 py-3">Contact Name</TableHead>
                                <TableHead className="px-4 py-3">Contacts Number</TableHead>
                                <TableHead className="px-4 py-3">List Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-black">
                            {contacts?.map((contacts: any, index: number) => (
                                <TableRow key={index} className="bg-white border-b border-stone-200">
                                    <TableCell className="px-4 py-5">
                                        {contacts.contactName}
                                    </TableCell>
                                    <TableCell className="px-4 py-5 text-blue-500">
                                        {contacts.contactNo}
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        {mailingList.mailingListName}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
        </div>
    )
}

export default ContactListView