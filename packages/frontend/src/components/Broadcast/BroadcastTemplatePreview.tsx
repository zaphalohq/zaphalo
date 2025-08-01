import { useQuery } from "@apollo/client"
import TemplatePreview from "../Template/TemplatePreview"
import { FindTemplateByDbId } from "@src/generated/graphql"
import { useEffect, useState } from "react"
type templateProps =  {
    dbTemplateId : string
}
const BroadcastTemplatePreview = ({dbTemplateId } : templateProps) => {
    const { data : templateData, loading: templateLoading, error, refetch } = useQuery(FindTemplateByDbId,{
        variables: {
            dbTemplateId
        },
        skip: !dbTemplateId
    })
    const [previewData, setPreviewData] = useState<any>({})
    useEffect(() => {
        if(templateData && !templateLoading)
            setPreviewData(templateData.findtemplateByDbId);
    },[templateData,templateLoading])
    
    return (
        <div>
            <div className='border-b p-4 border-gray-300'>
                Template Name : 
                <span className='font-semibold'>
                    {' ' + previewData?.templateName}
                </span>
            </div>
            <TemplatePreview
             templatePreviewData={previewData} 
             />
        </div>
    )
}

export default BroadcastTemplatePreview
