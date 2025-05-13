import { useMutation, useQuery } from "@apollo/client";
import { ChangeEvent, createContext, ReactNode, useState } from "react";
import { DeleteInstantsMutation, findAllInstants, UpdatedInstants, WhatsappInstantsCreation } from "@pages/Mutation/WhatsappInstants";

export interface InstantsContectProps {
    instantsData : any,
    setInstantsData : Function,
    formData : any,
    setFormData : Function,
    isNewInstants : Boolean,
    setIsNewInstants : any,
    CreateInstants : any,
    UpdateInstants : any,
    DeleteInstants : any,
    HandleInputChange : any,
    HandleFormData : any,
    HandleFormVisibility : any, 
    HandaleFeatchData : any,
    HandleDeleteInstants : any,
    data : any,
    loading : any,
    isFormVisible : any,
    refetch : any,
}

export const InstantsContext = createContext<InstantsContectProps | undefined>(undefined)

export const InstantsProvider = ({children} : { children: ReactNode }) => {
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


	//------------------------Handle Created Instants-------------------
	const [CreateInstants] = useMutation(WhatsappInstantsCreation);
	//-----------------------Submitting the data to backend----------------------------
 const HandleFormData = async () => {

    if (isNewInstants) {
        try {
            await CreateInstants({
                variables: {
                    ...formData
                }
            })
            HandaleFeatchData()

        } catch (err) {
            console.error('Error submitting form', err);
        }

    }
    else {
        //--------------------------Updating the data----------------------------------------
        try {
            await UpdateInstants({
                variables: {
                    ...formData
                }
            })
        } catch (err) {
            console.error('Error during updating', err)
        }
    }
}

	//------------------------Handle Updated Instants-------------------
	const [UpdateInstants] = useMutation(UpdatedInstants);

	//-----------------------------Handle Deleted Instants------------------------
	const [DeleteInstants] = useMutation(DeleteInstantsMutation);


	//-----------------------Handle form Visibility----------------------
	const [isFormVisible, setFormVisibility] = useState(false);
	const HandleFormVisibility = () => {
        console.log("..............");
        
		setFormVisibility(!isFormVisible)
	}

	//---------------------------Handle Input Data from form-------------------------
	const HandleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value
		})
	}


	//-------------------------------Handle Featch and refeatch----------------
    const { data, loading, refetch } = useQuery(findAllInstants);
	 const HandaleFeatchData = async ()  => {        
		try {
			const data1 = await data
			setInstantsData(data1?.findAllInstants)
			refetch();		
		} catch (err) {
			console.error('Error fetching data', err)
		}
	}

	 const HandleDeleteInstants = async (id: string) => {
        try {
            await DeleteInstants({
                variables: {
                    id: id
                }
            })
            HandaleFeatchData()
        } catch (err) {
            console.error("error from HandleDeleteInstants", err)
        }
    }

    return(
            <InstantsContext.Provider value={{
                instantsData,
                setInstantsData,
                formData,
                setFormData,
                isNewInstants,
                isFormVisible,
                setIsNewInstants,
                CreateInstants,
                UpdateInstants,
                DeleteInstants,
                HandleInputChange,
                HandleFormData,
                HandleFormVisibility,
                HandaleFeatchData,
                HandleDeleteInstants,
                data,
                loading,
                refetch,
            }}>
                {children}
            </InstantsContext.Provider>
    )
}