import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { TemplateContext } from "@components/Context/TemplateContext"
import { findWaAllTemplate, GET_TEMPLATE_STATUS, SearchedTemplate, WaTestTemplate } from "@src/generated/graphql"
import { GrDocumentUpdate } from "react-icons/gr";
import { languagesCode } from "./LanguageCode"
import usePagination from "@src/utils/usePagination"
import Pagination from "../UI/Pagination"
import { SearchWhite } from "../UI/Search"
import { toast } from "react-toastify"

const TemplateTable = ({ setIsTemplateFormVis, setIsTemplatePreviewVis }: any) => {
    const { setTemplateFormData, setSelectedTemplateInfo }: any = useContext(TemplateContext)
    const [testTemplate] = useMutation(WaTestTemplate);
    const [showSendPopup, setShowSendPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const [testTemplateData, setTestTemplateData] = useState({
        dbTemplateId: '',
        testPhoneNo: '',
        templateName: ''
    });


    const navigate = useNavigate()
    const [templates, setTemplates] = useState([{
        id: '',
        status: '',
        waTemplateId: '',
        templateName: '',
        category: '',
    }])

    const [GetTemplateStatus] = useMutation(GET_TEMPLATE_STATUS);

    // const HandelSendTemplate = (templateId: string, templateName: string) => {
    //     navigate("/broadcast", {
    //         state: {
    //             templateId,
    //             templateName
    //         },
    //     });
    // }

    const {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        setTotalPages
    } = usePagination()

    const { data: templateData,
        loading: templateLoading,
        refetch: templateRefetch }: any = useQuery(findWaAllTemplate, {
            variables: {
                currentPage,
                itemsPerPage
            }
        });
    useEffect(() => {
        templateRefetch()
        if (templateData && !templateLoading && !searchTerm) {
            setTemplates(templateData.findAllTemplate.allTemplates)
            setTotalPages(templateData.findAllTemplate.totalPages)
        }
    }, [templateData, searchTerm])

    const HandleTempalteStatus = (templateId: string) => {
        GetTemplateStatus({
            variables: { templateId },
        })
    }


    const handleSendTemplateToPhone = async () => {
        if (!testTemplateData.testPhoneNo.trim()) {
            toast.error("Please enter a phone number.")
            return;
        }
        const response = await testTemplate({
            variables: {
                testTemplateData
            }
        })
        setShowSendPopup(false);
        setTestTemplateData({
            dbTemplateId: '',
            testPhoneNo: '',
            templateName: ''
        });
    };

    const HandleLanguage = (languageCode: string) => {
        const languageValue = languagesCode.find((language) => language.value == languageCode)
        return languageValue?.label
    }

    const {
        data: searchedTemplateData,
        loading: searchedTemplateLoading,
        refetch: searchedTemplateRefetch } = useQuery(SearchedTemplate, {
            variables: {
                searchTerm
            },
            skip: !searchTerm
        });

    useEffect(() => {
        if (searchTerm) {
            searchedTemplateRefetch().then(({ data }) => {
                setTemplates(data.searchedTemplate?.searchedData)
                setTotalPages(0)
            });
        }
    }, [searchTerm])

    return (
        <div className="md:px-4">
            <div className="grid grid-cols-4 my-4">
                <div className='col-start-4'>
                    <SearchWhite HandleSearch={(e: any) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="relative w-full h-[65vh] overflow-y-scroll mt-4">
                <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
                    <thead className="sticky top-0 text-xs text-stone-700 uppercase bg-stone-200 truncate">
                        <tr>
                            <th scope="col" className="px-6 py-4 w-64 text-left truncate">Template Name</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Template Id</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Status</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Category</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Language</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Update</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Check Status</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Preview</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Test</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates?.map((template: any, index: number) => (
                            <tr key={index} className="bg-white border-b border-stone-200">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-left text-stone-900 max-w-[200px] truncate"
                                    title={template.templateName}
                                >
                                    {template.templateName}
                                </th>
                                <td
                                    className="px-6 py-4 text-center truncate max-w-[150px]"
                                    title={template.waTemplateId}
                                >
                                    {template.waTemplateId}
                                </td>
                                <td
                                    className="px-6 py-4 text-center truncate max-w-[150px]"
                                    title={template.status}
                                >
                                    <div className="flex items-center justify-center">
                                        {template.status.toLowerCase() == "approved" ? <p className="p-1.5 bg-green-600 rounded-full "></p> : <></>}
                                        {template.status.toLowerCase() == "rejected" ? <p className="p-1.5 bg-red-600 rounded-full "></p> : <></>}
                                        {template.status.toLowerCase() == "pending" ? <p className="p-1.5 bg-yellow-600 rounded-full "></p> : <></>}
                                        {template.status.toLowerCase() == "saved" ? <p className="p-1.5 bg-yellow-600 rounded-full "></p> : <></>}
                                        <p className="p-2">{template.status.toUpperCase()}</p>
                                    </div>

                                </td>
                                <td
                                    className="px-6 py-4 text-center truncate max-w-[150px]"
                                    title={template.category}
                                >
                                    {template.category.toUpperCase()}
                                </td>
                                <td
                                    className="px-6 py-4 text-center truncate max-w-[150px]"
                                    title={template.language}
                                >
                                    {`${HandleLanguage(template.language)}`}
                                    {/* {template.language} */}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        disabled={template.status.toLowerCase() === 'pending'}
                                        onClick={() => {
                                            const { account,
                                                attachment,
                                                status,
                                                __typename,
                                                id,
                                                waTemplateId,
                                                variables,
                                                button,
                                                templateImg,
                                                ...restTemplate } = template;
                                            const cleanedButtons = button.map(({ __typename, ...rest } : any) => rest);
                                            const cleanedVariables = variables.map(({ __typename, ...rest } : any) => rest);
                                            setTemplateFormData({
                                                accountId: account?.id,
                                                attachmentId: attachment?.id,
                                                variables: cleanedVariables,
                                                button: cleanedButtons,
                                                ...restTemplate
                                            })
                                            setSelectedTemplateInfo({
                                                dbTemplateId: template.id,
                                                waTemplateId: template.waTemplateId,
                                                status: template.status.toLowerCase(),
                                                templateImg: template.templateImg,
                                                templateOriginaName: attachment?.originalname
                                            })
                                            setIsTemplateFormVis(true)
                                        }}
                                        className={`text-lg text-center text-green-500 cursor-pointer hover:bg-gray-200 p-2 rounded disabled:bg-violet-200 disabled:cursor-default`}
                                    >
                                        <GrDocumentUpdate />
                                    </button>
                                </td>
                                <td onClick={() => HandleTempalteStatus(template.waTemplateId)}
                                    className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="sendTemplate"
                                >
                                    Check Status
                                </td>
                                <td onClick={() => {
                                    const { account,
                                        attachment,
                                        status,
                                        __typename,
                                        id,
                                        waTemplateId,
                                        variables,
                                        button,
                                        templateImg,
                                        ...restTemplate } = template;
                                    const cleanedButtons = button.map(({ __typename, ...rest }) => rest);
                                    const cleanedVariables = variables.map(({ __typename, ...rest }) => rest);
                                    setTemplateFormData({
                                        accountId: account?.id,
                                        attachmentId: attachment?.id,
                                        variables: cleanedVariables,
                                        button: cleanedButtons,
                                        ...restTemplate
                                    })
                                    setSelectedTemplateInfo({
                                        dbTemplateId: template.id,
                                        waTemplateId: template.waTemplateId,
                                        status: template.status.toLowerCase(),
                                        templateImg: template.templateImg,
                                        templateOriginaName: attachment?.originalname
                                    })
                                    setIsTemplatePreviewVis(true)
                                }}
                                    className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="preview"
                                >
                                    Preview
                                </td>
                                <td onClick={() => {
                                    setShowSendPopup(true);
                                    setTestTemplateData((prev) => ({
                                        ...prev,
                                        dbTemplateId: template.id,
                                        templateName: template.templateName
                                    }))
                                }
                                }
                                    className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="Test Template"
                                >
                                    Test
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            {showSendPopup && (
                <div className="fixed inset-0 bg-gray-800/30 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-lg text-gray-800 font-semibold mb-2">Test Template</h2>
                        <p className="text-sm text-gray-600 mb-4">Template: <strong>{testTemplateData.templateName}</strong></p>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Phone No</label>
                        <input
                            name='testPhoneNo'
                            type="text"
                            value={testTemplateData.testPhoneNo}
                            onChange={(e) => setTestTemplateData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value
                            }))}
                            placeholder="Enter phone number"
                            className="w-full p-2 border rounded-md mb-4 text-sm"
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowSendPopup(false)}
                                className="bg-gray-300 cursor-pointer text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSendTemplateToPhone()}
                                className="bg-green-500 cursor-pointer text-white px-4 py-1 rounded hover:bg-green-600"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TemplateTable
