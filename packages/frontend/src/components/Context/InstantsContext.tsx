import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, createContext, ReactNode, useState } from "react";
import {
    DeleteInstantsMutation,
    findAllInstants,
    WhatsappInstantsSave,
    WhatsappInstantsSyncAndSave,
    WhatsappInstantsTestAndSave,
} from "@src/generated/graphql";

export interface InstantsContectProps {
    instantsData: any,
    setInstantsData: Function,
    formData: any,
    setFormData: Function,
    isNewInstants: Boolean,
    setIsNewInstants: any,
    DeleteInstants: any,
    HandleInputChange: any,
    HandleCreateInstants: any,
    HandleFormVisibility: any,
    HandaleFeatchData: any,
    HandleDeleteInstants: any,
    data: any,
    loading: any,
    isFormVisible: any,
    refetch: any,
    HandleSyncAndSaveInstants: any,
    HandleTestAndSaveInstants: any,

}

export const InstantsContext = createContext<InstantsContectProps | undefined>(undefined)

export const InstantsProvider = ({ children }: { children: ReactNode }) => {
    const initialFormData = {
        id: "",
        name: "",
        appId: "",
        phoneNumberId: "",
        businessAccountId: "",
        accessToken: "",
        appSecret: "",
    }
    const [formData, setFormData] = useState(initialFormData);
    const [instantsData, setInstantsData] = useState<any>([initialFormData])
    const [isNewInstants, setIsNewInstants] = useState(false);

    const [saveInstants] = useMutation(WhatsappInstantsSave);
    const [SyncAndSaveInstants] = useMutation(WhatsappInstantsSyncAndSave);
    const [TestAndSaveInstants] = useMutation(WhatsappInstantsTestAndSave);

    const { data, loading, refetch } = useQuery(findAllInstants);
    const HandaleFeatchData = async () => {
        try {
            const { data: newData } = await refetch();
            setInstantsData(newData?.findAllInstants)
        } catch (err) {
            console.error('Error fetching data', err)
        }
    }

    const HandleCreateInstants = async () => {
        const { id, __typename, defaultSelected, ...restFormData } : any = formData
        try {
            const response = await saveInstants({
                variables: {
                    whatsappInstantsData: { ...restFormData },
                    instanceId: id
                }
            })
            
            if (response.data) {
                await HandaleFeatchData()
                HandleFormVisibility()
                setIsNewInstants(false)
            }


        } catch (err) {
            console.error('Error submitting form', err);
        }

    }

    const HandleSyncAndSaveInstants = async () => {
        const { id, __typename, defaultSelected, ...restFormData } : any = formData

        try {
            const response = await SyncAndSaveInstants({
                variables: {
                    whatsappInstantsData: { accountId: id,...restFormData },
                }
            })
            if (response.data) {
                setInstantsData([])
                await HandaleFeatchData()
                HandleFormVisibility()
                setIsNewInstants(false)
            }


        } catch (err) {
            console.error('Error submitting form', err);
        }
    }


    const HandleTestAndSaveInstants = async () => {
        const { id, __typename, defaultSelected, ...restFormData } : any = formData

        try {
            const response = await TestAndSaveInstants({
                variables: {
                    whatsappInstantsData: { accountId : id, ...restFormData },
                }
            })

            if (response.data) {
                HandaleFeatchData()
                HandleFormVisibility()
                setIsNewInstants(false)
            }


        } catch (err) {
            console.error('Error submitting form', err);
        }

    }



    const [DeleteInstants] = useMutation(DeleteInstantsMutation);
    const [isFormVisible, setFormVisibility] = useState(false);
    const HandleFormVisibility = () => {
        setFormVisibility(!isFormVisible)
    }

    const HandleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }



    const HandleDeleteInstants = async (waAccountId: string) => {
        console.log(waAccountId,'deleteid.......................');
        
        try {
            await DeleteInstants({
                variables: {
                    waAccountId
                }
            })
            HandaleFeatchData()
        } catch (err) {
            console.error("error from HandleDeleteInstants", err)
        }
    }

    return (
        <InstantsContext.Provider value={{
            instantsData,
            setInstantsData,
            formData,
            setFormData,
            isNewInstants,
            isFormVisible,
            setIsNewInstants,
            DeleteInstants,
            HandleInputChange,
            HandleCreateInstants,
            HandleFormVisibility,
            HandaleFeatchData,
            HandleDeleteInstants,
            data,
            loading,
            refetch,
            HandleSyncAndSaveInstants,
            HandleTestAndSaveInstants,
        }}>
            {children}
        </InstantsContext.Provider>
    )
}