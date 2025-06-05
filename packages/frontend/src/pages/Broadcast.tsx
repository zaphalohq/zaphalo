// import { useQuery } from "@apollo/client";
// import { useEffect, useState } from "react";
// import { Find_ALL_TEMPLATE } from "./Mutation/Template";
// import { FiChevronDown } from "react-icons/fi";

// const Broadcast = () => {
//     const { data: templateData, loading: templateLoading, refetch: templateRefetch }: any = useQuery(Find_ALL_TEMPLATE);
//     const [templates, setTemplates] = useState([{
//         account: '',
//         templateName: '',
//         category: '',
//         language: '',
//         bodyText: ``,
//         footerText: '',
//         button: [],
//         variables: [],
//         headerType: '',
//         header_handle: '',
//         fileUrl: ''
//     }])
//     useEffect(() => {
//         try {
//             templateRefetch()
//             if (templateData && !templateLoading) {
//                 console.log(templateData.findAllTemplate);
//                 setTemplates(templateData.findAllTemplate)
//             }
//         } catch (error) {
//             console.error('template data fetch error ', error)
//         }

//     }, [templateData])

//     return (
//         <div className="mt-4 bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

//             {/* Metrics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="bg-blue-50 p-4 font-semibold rounded-lg">Select Template</div>
//                 <div className="bg-blue-50 p-4 font-semibold">Select Mailing List</div>
//                 <div></div>
//             </div>
//             <div className="absolute bg-blue-50 p-4 font-semibold rounded-lg">
//                 <div>fsdfsdfdsf</div>
//                 <div>fdsfsdfdsf</div>
//                 <div>fsdfsdfsd</div>
//             </div>

//             {/* Chart Section */}
//             <div className="bg-gray-50 p-4 rounded-lg shadow mb-8">
//                 <h2 className="text-lg font-semibold text-gray-700 mb-4">Template Preview</h2>
//                 <div className="h-64 w-full md:w-[50%]">

//                 </div>
//                 <div className="flex justify-center mt-4 space-x-6">

//                     <div className="flex items-center">
//                         <div
//                             className="w-4 h-4 mr-2 rounded-sm"

//                         />
//                         <span className="text-sm text-gray-600">fdsfsfdsfsd</span>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Broadcast


import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Find_ALL_TEMPLATE, SEND_TEMPLATE_TO_WHATSAPP } from "./Mutation/Template";
import { FiChevronDown } from "react-icons/fi";
import { FindAll_Mailing_List } from "./Mutation/MailingList";
import TemplatePreview from "@src/components/Template/TemplatePreview";

const Broadcast = () => {
    const { data: templateData, loading: templateLoading, refetch: templateRefetch }: any = useQuery(Find_ALL_TEMPLATE);
    const [templates, setTemplates] = useState<any[]>([]);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [showMailingDropdown, setShowMailingDropdown] = useState(false);
    const [broadcastData, setBroadcastData] = useState({
        templateId: '',
        templateName: '',
        mailingListId: '',
        mailingListName: '',
        variables: [''],
        URL: '',
        headerType: '',
        language: ''
    })
    const [currentTemplate, setCurrentTemplate] = useState({
        headerType: ''
    })


    const { data: mailingListData, refetch: mailingListRefetch, loading: mailingListLoading } = useQuery(FindAll_Mailing_List)
    const [mailingLists, setMailingLists] = useState<any[]>([])

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
                setTemplates(templateData.findAllTemplate);
            }
        } catch (error) {
            console.error('Template fetch error:', error);
        }
    }, [templateData]);

    const [variableMatches, setVariableMatches] = useState([])
    const handleTemplateSelect = (templateId: string, templateName: string) => {
        const currentTemplate = templates.find(t => t.id === templateId)
        setCurrentTemplate(currentTemplate)
        setBroadcastData({ ...broadcastData, templateId, templateName, headerType : currentTemplate.headerType, language : currentTemplate.language });
        setVariableMatches(currentTemplate.bodyText.match(/{{\d+}}/g) || []);
        setShowTemplateDropdown(false);

    };

    const handleMailingSelect = (mailingListId: string, mailingListName: string) => {
        setBroadcastData({ ...broadcastData, mailingListId, mailingListName });
        setShowMailingDropdown(false);
    };

    const HandleSendTempate = async () => {
        try {
            const response = await sendTemplateToWhatssapp({
                variables: {
                    broadcastData
                },
            });

            console.log("Response:", response.data.sendTemplateToWhatssapp);
        } catch (err) {
            console.error("Mutation error:", err);
        }
    }

    const handleVariableChange = (index: number, value: string) => {
        const updatedVariables = [...broadcastData.variables];
        updatedVariables[index] = value;
        setBroadcastData(prev => ({
            ...prev,
            variables: updatedVariables,
        }));
    };

    return (
        <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Broadcast Template</div>
        <div className="mt-4 bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {/* Template Dropdown */}
                <div className="relative">
                    <div
                        className="bg-blue-50 p-4 font-semibold rounded-lg cursor-pointer flex justify-between items-center"
                        onClick={() => {
                            setShowTemplateDropdown(!showTemplateDropdown);
                            setShowMailingDropdown(false);
                        }}
                    >
                        {broadcastData.templateName || "Select Template"}
                        <FiChevronDown />
                    </div>
                    {showTemplateDropdown && (
                        <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-20 max-h-60 overflow-auto">
                            {templates.map((template, index) => (
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

                {/* Mailing List Dropdown */}
                <div className="relative">
                    <div
                        className="bg-blue-50 p-4 font-semibold rounded-lg cursor-pointer flex justify-between items-center"
                        onClick={() => {
                            setShowMailingDropdown(!showMailingDropdown);
                            setShowTemplateDropdown(false);
                        }}
                    >
                        {broadcastData.mailingListName || "Select Mailing List"}
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
                <button onClick={HandleSendTempate} className="bg-violet-500 hover:bg-violet-600 text-white rounded font-semibold text-lg cursor-pointer">Broadcast</button>
            </div>

            {/* Template Preview Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow mt-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Template Preview</h2>
                {/* <div className="h-64 w-full md:w-[50%] bg-white border rounded-md p-4 overflow-auto"> */}
                {broadcastData.templateId ? (
                    <div className="flex">
                        <div>
                            <TemplatePreview templatePreviewData={currentTemplate} />
                        </div>
                        <div className="w-full p-4 m-4 mt-11">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 shadow-sm">
                                <label className="text-gray-700 font-medium mb-2 sm:mb-0 sm:w-1/3">
                                    {currentTemplate?.headerType} — <span className="text-violet-500">URL</span>
                                </label>
                                <input
                                    name="variables"
                                    type="URL"
                                    placeholder="Enter your value"
                                    onChange={(e) => setBroadcastData((prevData) => ({ ...prevData, URL: e.target.value }))}
                                    className="w-full sm:w-2/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                                />
                            </div>
                            {variableMatches.map((variable: any, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 shadow-sm">
                                    <label className="text-gray-700 font-medium mb-2 sm:mb-0 sm:w-1/3">
                                        Body — <span className="text-violet-500">{variable}</span>
                                    </label>
                                    <input
                                        name="variables"
                                        type="text"
                                        placeholder="Enter your value"
                                        value={broadcastData.variables[index]}
                                        onChange={(e) => handleVariableChange(index, e.target.value)}
                                        className="w-full sm:w-2/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                ) : (
                    <></>
                )}
                {/* </div> */}
            </div>
        </div>
        </div>
    );
};

export default Broadcast;
