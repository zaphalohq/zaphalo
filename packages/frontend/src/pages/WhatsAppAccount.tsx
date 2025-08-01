import { useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import SubmitButton from "@components/UI/SubmitButton";
import InstantsForm from "@components/WhatsappInstants/InstantsForm";
import TableListView from "@components/WhatsappInstants/TableListView";
import { InstantsContext, InstantsProvider } from "@components/Context/InstantsContext";

const WhatsAppAccountContent = () => {
	const {
		HandaleFeatchData,
		data,
		instantsData,
		setFormData,
		setIsNewInstants,
		HandleFormVisibility,
		isFormVisible,
	}: any = useContext(InstantsContext)

	useEffect(() => {
		HandaleFeatchData()
	}, [data])

	return (
		<div>
			<div className='font-bold text-lg border-gray-300 p-4 border-b'>Whatsapp Account</div>
			<div className="grid grid-cols-6 pt-4 px-4">
				<div className="md:col-start-6 md:pb-0 col-start-1 pb-4">
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
					} title="Create" Icon={FaPlus} />
				</div>

			</div>

			<div>
				<TableListView />
			</div>
			{isFormVisible ? <InstantsForm /> : null}
		</div>
	)
}

const WhatsappAccount = () => {
	return (
		<InstantsProvider>
			<WhatsAppAccountContent />
		</InstantsProvider>
	);
};

export default WhatsappAccount
