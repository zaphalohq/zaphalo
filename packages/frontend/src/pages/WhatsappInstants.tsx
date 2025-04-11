import { useContext, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import SubmitButton from "../components/UI/SubmitButton"
import { InstantsContext, InstantsProvider } from "../components/Context/InstantsContext"
import InstantsForm from "../components/WhatsappInstants/InstantsForm"
import TableListView from "../components/WhatsappInstants/TableListView"

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
		<div className="h-screen">
			<div className="grid grid-cols-5 pt-4 px-4">
				<div className="col-start-5">
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
				{/* list view your are seeing on the page */}
				<TableListView  />
			</div> 
			{/* input and update form */}
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
