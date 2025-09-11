import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { findAllInstants, findAllMailingList } from "@src/generated/graphql";
import { findAllApprovedTemplate, SEND_TEMPLATE_TO_WHATSAPP } from "@src/generated/graphql";
import TemplatePreview from "@src/components/Template/TemplatePreview";
import { toast } from 'react-toastify';

const SendBroadcast = ({ setIsSendBroadcastVis } : any) => {
    const navigate = useNavigate();
    const { data: templateData, loading: templateLoading, refetch: templateRefetch }: any = useQuery(findAllApprovedTemplate);
    const [allTemplates, setAllTemplates] = useState<any[]>([]);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [showMailingDropdown, setShowMailingDropdown] = useState(false);
    const [broadcastData, setBroadcastData] = useState({
        accountId: '',
        broadcastName: '',
        templateId: '',
        mailingListId: '',
    })
    const [selectedBroadcastData, setSelectedBroadcastData] = useState({
        accountName: '',
        templateName: '',
        mailingListName: '',
    })
    const [currentTemplate, setCurrentTemplate] = useState({
        headerType: '',
        language: ''
    })
    const [mailingLists, setMailingLists] = useState<any[]>([])
    const [allAccounts, setAllAccounts] = useState<any[]>([])

    const { data: mailingListData, refetch: mailingListRefetch, loading: mailingListLoading } = useQuery(findAllMailingList)
    const [sendTemplateToWhatssapp, { data, loading, error }] = useMutation(SEND_TEMPLATE_TO_WHATSAPP);

    useEffect(() => {
        try {
            templateRefetch();
            if (mailingListData && !mailingListLoading) {
                setMailingLists(mailingListData.findAllMailingList);
            }
        } catch (error) {
            console.error('mailingListData fetch error:', error);
        }
    }, [mailingListData]);

    useEffect(() => {
        try {
            mailingListRefetch();
            if (templateData && !templateLoading) {
                setAllTemplates(templateData.findAllApprovedTemplate);
            }
        } catch (error) {
            console.error('Template fetch error:', error);
        }
    }, [templateData]);

    const { data: accountData, loading: accountLoading, refetch: accountRefetch } = useQuery(findAllInstants)
    useEffect(() => {
        try {
            accountRefetch();
            if (accountData && !accountLoading) {
                setAllAccounts(accountData.findAllInstants);
            }
        } catch (error) {
            console.error('Account fetch error:', error);
        }
    }, [accountData]);

    const handleAccountSelect = async (accountId: string, accountName: string) => {
        setBroadcastData({ ...broadcastData, accountId });
        setSelectedBroadcastData((prev) => ({ ...prev, accountName }))
        setShowAccountDropdown(false);

    };

    const handleTemplateSelect = async (templateId: string, templateName: string) => {
        const currentTemplate = await allTemplates.find(t => t.id === templateId)
        setCurrentTemplate(currentTemplate)
        setBroadcastData({ ...broadcastData, templateId });
        setSelectedBroadcastData((prev) => ({ ...prev, templateName }))
        setShowTemplateDropdown(false);
    };

    const handleMailingSelect = (mailingListId: string, mailingListName: string) => {
        setBroadcastData({ ...broadcastData, mailingListId });
        setSelectedBroadcastData((prev) => ({ ...prev, mailingListName }))
        setShowMailingDropdown(false);
    };

    const HandleSendTempate = async () => {
    

        if (
            !broadcastData.accountId ||
            !broadcastData.templateId ||
            !broadcastData.mailingListId ||
            !broadcastData.broadcastName
        ) {
            toast.error('Please fill all required fields before broadcasting.');
            return;
        }

        try {
            const response = await sendTemplateToWhatssapp({
                variables: {
                    broadcastData
                },
            });


            if (response.data?.BroadcastTemplate?.success) {
                toast.success(`${response.data?.BroadcastTemplate?.message}`);
                setIsSendBroadcastVis(false)
            }
        } catch (err) {
            console.error("Mutation error:", err);
        }
    }

    return (
        <div>
            <div className="mt-4 bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                    <div className="relative">
                        <div
                            className="bg-blue-50 p-4 font-semibold rounded-lg cursor-pointer flex justify-between items-center"
                            onClick={() => {
                                setShowAccountDropdown(!showAccountDropdown);
                                setShowMailingDropdown(false);
                                setShowTemplateDropdown(false);

                            }}
                        >
                            {selectedBroadcastData.accountName || "Select Account"}
                            <FiChevronDown />
                        </div>
                        {showAccountDropdown && (
                            <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-20 max-h-60 overflow-auto">
                                {allAccounts.map((account, index) => (
                                    <div
                                        key={index}
                                        className="p-3 hover:bg-blue-100 cursor-pointer"
                                        onClick={() => handleAccountSelect(account.id, account.name)}
                                    >
                                        <div className="font-medium">{account.name}</div>
                                        <div className="text-sm text-gray-500">{account.phoneNumberId}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <div
                            className="bg-blue-50 p-4 font-semibold rounded-lg cursor-pointer flex justify-between items-center"
                            onClick={() => {
                                setShowTemplateDropdown(!showTemplateDropdown);
                                setShowMailingDropdown(false);
                                setShowAccountDropdown(false);
                            }}
                        >
                            {selectedBroadcastData.templateName || "Select Template"}
                            <FiChevronDown />
                        </div>
                        {showTemplateDropdown && (
                            <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-20 max-h-60 overflow-auto">
                                {allTemplates.map((template, index) => (
                                    <div
                                        key={index}
                                        className="p-3 hover:bg-blue-100 cursor-pointer"
                                        onClick={() => handleTemplateSelect(template.id, template.templateName)}
                                    >
                                        <div className="font-medium">{template.templateName}</div>
                                        <div className="text-sm text-gray-500">{template.category} | {template.language}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <div
                            className="bg-blue-50 p-4 font-semibold rounded-lg cursor-pointer flex justify-between items-center"
                            onClick={() => {
                                setShowMailingDropdown(!showMailingDropdown);
                                setShowTemplateDropdown(false);
                                setShowAccountDropdown(false);
                            }}
                        >
                            {selectedBroadcastData.mailingListName || "Select Contact List"}
                            <FiChevronDown />
                        </div>
                        {showMailingDropdown && (
                            <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-20">
                                {mailingLists.map((mailingList, index) => (
                                    <div
                                        key={index}
                                        className="p-3 hover:bg-blue-100 cursor-pointer"
                                        onClick={() => handleMailingSelect(mailingList.id, mailingList.mailingListName)}
                                    >
                                        {mailingList.mailingListName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={HandleSendTempate}
                        className="bg-green-500 hover:bg-green-600 text-white rounded font-semibold text-lg cursor-pointer">Broadcast</button>
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Broadcast Name</label>
                        <input
                            type="text"
                            value={broadcastData.broadcastName}
                            onChange={(e) => setBroadcastData({ ...broadcastData, broadcastName: e.target.value })}
                            placeholder="Enter broadcast name"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow mt-10">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Template Preview</h2>
                    {broadcastData.templateId ? (
                        <div className="flex">
                            <div>
                                <TemplatePreview templatePreviewData={currentTemplate} />
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendBroadcast;
