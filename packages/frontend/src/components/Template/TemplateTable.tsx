import { useMutation, useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react"
import { Find_ALL_TEMPLATE, GET_TEMPLATE_STATUS, Send_Template_Message } from "@pages/Mutation/Template"
import { TemplateContext } from "../Context/TemplateContext"
import { useNavigate } from "react-router-dom"

const TemplateTable = ({ setIsTemplatePreviewVis }: any) => {
    const { setTemplateFormData }: any = useContext(TemplateContext)
    const navigate = useNavigate()
    const [templates, setTemplates] = useState([{
        id: '',
        status: '',
        templateId: '',
        templateName: '',
        category: '',
    }])

    const [templateId, setTemplateId] = useState("")
    const [GetTemplateStatus] = useMutation(GET_TEMPLATE_STATUS)

    // const [SendTemplateMessage] = useMutation(Send_Template_Message)
    const HandelSendTemplate = (templateId: string, templateName: string) => {
        navigate("/broadcast", {
            state: {
                templateId,
                templateName
            },
        });
    }

    const { data: templateData, loading: templateLoading, refetch: templateRefetch }: any = useQuery(Find_ALL_TEMPLATE);
    useEffect(() => {
        console.log(templateData, "...........................teddd..............................");
        templateRefetch()
        if (templateData && !templateLoading) {
            console.log(templateData.findAllTemplate);
            setTemplates(templateData.findAllTemplate)
        }
    }, [templateData])

    const HandleTempalteStatus = (templateId: string) => {
        GetTemplateStatus({
            variables: { templateId },
        })
    }

    return (
        <div>
            <div className="relative overflow-x-auto md:pt-4 md:p-4 rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
                    <thead className="text-xs text-stone-700 uppercase bg-stone-200 truncate">
                        <tr>
                            <th scope="col" className="px-6 py-4 w-64 text-left truncate">Template Name</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Template Id</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Status</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Category</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Check Template Status</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">preview</th>
                            <th scope="col" className="px-6 py-4 text-center truncate">Send Template</th>
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
                                    title={template.templateId}
                                >
                                    {template.templateId}
                                </td>
                                <td
                                    className="px-6 py-4 text-center truncate max-w-[150px]"
                                    title={template.status}
                                >
                                    <div className="flex items-center justify-center">
                                        {template.status.toLowerCase() == "approved" ? <p className="p-1.5 bg-green-600 rounded-full "></p> : <></>}
                                        {template.status.toLowerCase() == "rejected" ? <p className="p-1.5 bg-red-600 rounded-full "></p> : <></>}
                                        {template.status.toLowerCase() == "pending" ? <p className="p-1.5 bg-yellow-600 rounded-full "></p> : <></>}
                                        <p className="p-2">{template.status.toUpperCase()}</p>
                                    </div>

                                </td>
                                <td
                                    className="px-6 py-4 text-center truncate max-w-[150px]"
                                    title={template.category}
                                >
                                    {template.category.toUpperCase()}
                                </td>
                                <td onClick={() => HandleTempalteStatus(template.templateId)}
                                    className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="sendTemplate"
                                > 
                                    Check Template Status
                                </td>
                                <td onClick={() => {
                                    setTemplateFormData(template)
                                    setIsTemplatePreviewVis(true)
                                }}
                                    className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="sendTemplate"
                                >
                                    preview
                                </td>
                                <td onClick={() => HandelSendTemplate(template.id, template.templateName)}
                                    className="px-6 py-4 text-center truncate max-w-[150px] underline text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="sendTemplate"
                                >
                                    send template
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TemplateTable
