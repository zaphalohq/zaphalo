import { useContext, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "@components/UI/SubmitButton"
import { InstantsContext, InstantsProvider } from "@components/Context/InstantsContext"
import InstantsForm from "@components/WhatsappInstants/InstantsForm"
import TableListView from "@components/WhatsappInstants/TableListView"

const WhatsappInstantsContent = () => {
	const { 
		HandaleFeatchData,
		 data, 
		 setFormData,
		 setIsNewInstants,
		 HandleFormVisibility,
		isFormVisible,
		} : any = useContext(InstantsContext)


	// handle the fetch for the first time when page load 
	useEffect(() => {
		HandaleFeatchData()
	}, [data])

   
	return (
		 <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Mailing List</div>
			<div className="grid grid-cols-5 pt-4 px-4">
				<div className="md:col-start-5 md:pb-0 col-start-1 col-end-5 pb-4">
					<SubmitButton onClick={() => {
						setFormData({
							id: "",
							name: "",
							appId: "",
							phoneNumberId: "",
							businessAccountId: "",
							accessToken: "",
							appSecret: "",
						})
						setIsNewInstants(true)
						HandleFormVisibility()
					} 
					}   title="Create New Instants" Icon={FaPlus} />
				</div>

			</div>

			<div>
				<TableListView  />
			</div> 
			{isFormVisible ? <InstantsForm /> : null}
		</div>
	)
}

const WhatsappInstants = () => {
	return (
	  <InstantsProvider>
		<WhatsappInstantsContent />
	  </InstantsProvider>
	);
  };

export default WhatsappInstants
