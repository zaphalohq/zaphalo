import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import SubmitButton from "@components/UI/SubmitButton";
import InstantsForm from "@components/WhatsappInstants/InstantsForm";
import TableListView from "@components/WhatsappInstants/TableListView";
import { InstantsContext, InstantsProvider } from "@components/Context/InstantsContext";
import WhatsAppAccountView from "@src/modules/whatsapp/components/WhatsAppAccountView"
import WhatsAppAccountForm from "@src/modules/whatsapp/components/WhatsAppAccountForm";


const WhatsappAccount = () => {
	const [isFormVisible, setisFormVisible] = useState(false);
	const [waAccount, setwaAccount] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50">

			{isFormVisible ? (<WhatsAppAccountForm waAccountId={waAccount} onBack={() => setisFormVisible(false)}/>) :
				(<WhatsAppAccountView
					setisFormVisible={setisFormVisible}
					setwaAccount={setwaAccount}
					onCreate={() => {
						setisFormVisible(true)
						setwaAccount(false)
					}}

				/>)}
		</div>
	)
};

export default WhatsappAccount
