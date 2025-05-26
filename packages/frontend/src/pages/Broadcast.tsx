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


import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Find_ALL_TEMPLATE } from "./Mutation/Template";
import { FiChevronDown } from "react-icons/fi";
import { FindAll_Mailing_List } from "./Mutation/MailingList";

const Broadcast = () => {
    const { data: templateData, loading: templateLoading, refetch: templateRefetch }: any = useQuery(Find_ALL_TEMPLATE);
    const [templates, setTemplates] = useState<any[]>([]);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [showMailingDropdown, setShowMailingDropdown] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedMailingList, setSelectedMailingList] = useState('');

    // Dummy mailing list
const { data: mailingListData, refetch : mailingListRefetch, loading : mailingListLoading } = useQuery(FindAll_Mailing_List)
const [ mailingLists, setMailingLists ] = useState<any[]>([])

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

    const handleTemplateSelect = (templateName: string) => {
        setSelectedTemplate(templateName);
        setShowTemplateDropdown(false);
    };

    const handleMailingSelect = (listName: string) => {
        setSelectedMailingList(listName);
        setShowMailingDropdown(false);
    };

    return (
        <div className="mt-4 bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl mx-auto relative">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Metrics Cards */}
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
                        {selectedTemplate || "Select Template"}
                        <FiChevronDown />
                    </div>
                    {showTemplateDropdown && (
                        <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-20 max-h-60 overflow-auto">
                            {templates.map((template, index) => (
                                <div
                                    key={index}
                                    className="p-3 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => handleTemplateSelect(template.templateName)}
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
                        {selectedMailingList || "Select Mailing List"}
                        <FiChevronDown />
                    </div>
                    {mailingLists && (
                        <div className="absolute top-full left-0 w-full bg-white border shadow-md rounded-md mt-1 z-20">
                            {mailingLists.map((mailingList, index) => (
                                <div
                                    key={index}
                                    className="p-3 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => handleMailingSelect(mailingList)}
                                >
                                    {mailingList.mailingListName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Template Preview Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow mt-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Template Preview</h2>
                <div className="h-64 w-full md:w-[50%] bg-white border rounded-md p-4 overflow-auto">
                    {selectedTemplate ? (
                        <pre className="text-sm text-gray-700">
                            {JSON.stringify(
                                templates.find(t => t.templateName === selectedTemplate),
                                null,
                                2
                            )}
                        </pre>
                    ) : (
                        <div className="text-gray-500 italic">fdfd</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Broadcast;
