import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, createContext, ReactNode, useState } from "react";
import { toast } from 'react-toastify';

import {
  DeleteInstantsMutation,
  findAllInstants,
  WhatsAppAccountCreate,
  WhatsAppAccountSave,
  WhatsAppAccountSync,
  WhatsAppAccountTestConnection,
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
  HandleWhatsAppAccountCreateOrSave: any,
  HandleFormVisibility: any,
  HandaleFeatchData: any,
  HandleDeleteInstants: any,
  data: any,
  loading: any,
  isFormVisible: any,
  refetch: any,
  WhatsAppAccountSync: any,
  HandleWhatsAppAccountTestConnection: any,

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
    waWebhookToken: ""
  }
  const [formData, setFormData] = useState(initialFormData);
  const [instantsData, setInstantsData] = useState<any>([initialFormData])
  const [isNewInstants, setIsNewInstants] = useState(false);

  const [whatsAppAccountCreate] = useMutation(WhatsAppAccountCreate);
  const [whatsAppAccountSave] = useMutation(WhatsAppAccountSave);

  const [whatsAppAccountSync] = useMutation(WhatsAppAccountSync);
  const [whatsAppAccountTestConnection] = useMutation(WhatsAppAccountTestConnection);

  const { data, loading, refetch } = useQuery(findAllInstants);

  const HandaleFeatchData = async () => {
    try {
      const { data: newData } = await refetch();
      setInstantsData(newData?.findAllInstants)
    } catch (err) {
      console.error('Error fetching data', err)
    }
  }

  const HandleWhatsAppAccountCreate = async () => {
    const { id, __typename, defaultSelected, ...restFormData } : any = formData
    try {
      const response = await whatsAppAccountCreate({
        variables: {
          whatsAppAccountData: { accountId: id, ...restFormData },
        }
      })

      if (response.data) {
        await HandaleFeatchData()
        HandleFormVisibility()
        setIsNewInstants(false)
      }
    } catch (err) {
      toast.error(`${err}`);
    }
  }

  const HandleWhatsAppAccountSave = async () => {
    const { id, __typename, defaultSelected, ...restFormData } : any = formData
    try {
      const response = await whatsAppAccountSave({
        variables: {
          whatsAppAccountData: { accountId: id, ...restFormData },
        }
      })

      if (response.data) {
        setInstantsData([])
        await HandaleFeatchData()
        HandleFormVisibility()
        setIsNewInstants(false)
      }
    } catch (err) {
      toast.error(`${err}`);
    }
  }


  const HandleWhatsAppAccountCreateOrSave = async () => {
    const { id, __typename, defaultSelected, ...restFormData } : any = formData
    if (!id){
      HandleWhatsAppAccountCreate()
    }else{
      HandleWhatsAppAccountSave()
    }
  }


  const HandleWhatsAppAccountSync = async () => {
    const { id, __typename, defaultSelected, ...restFormData } : any = formData

    try {
      const response = await whatsAppAccountSync({
        variables: {
          whatsAppAccountData: { accountId: id, ...restFormData },
        }
      })
      if (response.data) {
        setInstantsData([])
        await HandaleFeatchData()
        HandleFormVisibility()
        setIsNewInstants(false)
      }
    } catch (err) {
      toast.error(`${err}`);
    }
  }


  const HandleWhatsAppAccountTestConnection = async () => {
    const { id, __typename, defaultSelected, ...restFormData } : any = formData

    try {
      const response = await whatsAppAccountTestConnection({
        variables: {
          whatsAppAccountData: { accountId : id, ...restFormData },
        }
      })
      if (response.data) {
        HandaleFeatchData()
        HandleFormVisibility()
        setIsNewInstants(false)
        toast.success(`${response.data.WaAccountTestConnection.message}`);
      }
    } catch (err) {
      toast.error(`${err}`);
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
      HandleWhatsAppAccountCreateOrSave,
      HandleFormVisibility,
      HandaleFeatchData,
      HandleDeleteInstants,
      data,
      loading,
      refetch,
      HandleWhatsAppAccountSync,
      HandleWhatsAppAccountTestConnection,
    }}>
    {children}
  </InstantsContext.Provider>
  )
}