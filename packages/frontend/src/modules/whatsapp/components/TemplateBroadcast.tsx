import { useQuery } from '@apollo/client'
import { Button } from '@src/components/UI/button'
import { Card, CardContent } from '@src/components/UI/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/UI/table'
import { GetBroadcastsOfTemplate } from '@src/generated/graphql'
import { PageHeader } from '@src/modules/ui/layout/page/components/PageHeader'
import React, { useEffect, useState } from 'react'

const TemplateBroadcast = ({ templateId, onBack }) => {

    const [loading, setLoading] = useState(false);

    const { data: brodcastData, loading: loadingData, error, refetch } = useQuery(GetBroadcastsOfTemplate, {
        variables: { templateId: templateId },
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

    const broadcasts = brodcastData?.getBroadcastsOfTemplate;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <PageHeader title="Broadcast List"
                    className="w-full"
                    actions={
                        <>
                            <Button
                                onClick={() => onBack()}
                            >
                                Back To Templates
                            </Button>
                        </>
                    } />
            </div>
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
                        <TableHeader className="text-black">
                            <TableRow className="bg-gray-100 uppercase text-sm font-semibold">
                                <TableHead className="px-4 py-3">Broadcast Name</TableHead>
                                <TableHead className="px-4 py-3">Broadcast Count</TableHead>
                                <TableHead className="px-4 py-3">Status</TableHead>
                                <TableHead className="px-4 py-3">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-black">
                            {broadcasts?.map((broadcast: any, index: number) => (
                                <TableRow key={index} className="bg-white border-b border-stone-200">
                                    <TableCell className="px-4 py-5">
                                        {broadcast.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-5 text-blue-500">
                                        {broadcast.sentCount}
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        {broadcast.status}
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        {broadcast.createdAt}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
        </div>
    )
}

export default TemplateBroadcast