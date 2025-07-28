import { useContext } from "react";
import { FaSave } from "react-icons/fa";
import { SiTestrail } from "react-icons/si";
import { FaSyncAlt } from "react-icons/fa";
import InputLabel from "@components/UI/InputLabel";
import CloseButton from "@components/UI/CloseButton";
import SubmitButton from "@components/UI/SubmitButton";
import { InstantsContext } from "@components/Context/InstantsContext";

const InstantsForm = () => {
	const {
		isNewInstants,
		setIsNewInstants,
		HandleFormVisibility,
		HandleCreateInstants,
		formData,
		HandleInputChange,
		HandleSyncAndSaveInstants,
		HandaleFeatchData,
		HandleTestAndSaveInstants,
	}: any = useContext(InstantsContext)
	return (
		<div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center">
			<CloseButton onClick={() => {
				setIsNewInstants(false)
				HandleFormVisibility()
			}} right="right-70" top="top-35" />
			<form className="grid grid-cols-2 place-content-center px-8 gap-4 p-8 bg-stone-50 rounded-lg ">
				<div className="col-span-2">
					<InputLabel required={true} type="text" name='name' value={formData.name} HandleInputChange={HandleInputChange} title="Name" placeholder="eg: ConstroERP" />
				</div>
				<InputLabel required={true} type="text" name='appId' value={formData.appId} HandleInputChange={HandleInputChange} title="App ID" placeholder="App ID" />
				<InputLabel required={true} type="password" name='appSecret' value={formData.appSecret} HandleInputChange={HandleInputChange} title="App Secret" placeholder="App Secret" />
				<InputLabel required={true} type="text" name='phoneNumberId' value={formData.phoneNumberId} HandleInputChange={HandleInputChange} title="Phone Number ID" placeholder="Phone Number ID" />
				<InputLabel required={true} type="text" name='businessAccountId' value={formData.businessAccountId} HandleInputChange={HandleInputChange} title="Business Account ID" placeholder="Business Account ID" />
				<div className="col-span-2">
					<InputLabel required={true} type="password" name='accessToken' value={formData.accessToken} HandleInputChange={HandleInputChange} title="Access Token" placeholder="Access Token" />
				</div>
				<div className="grid grid-cols-3 col-span-2 gap-4 pt-4">
					<SubmitButton type="button" onClick={async () => {
							await HandleCreateInstants()
							HandaleFeatchData()
					}} Icon={FaSave} title='Save Template' />
					<SubmitButton type="button" onClick={async () => {
							await HandleSyncAndSaveInstants()
							HandaleFeatchData()
					}} Icon={FaSyncAlt} title='Sync Template' />
					<SubmitButton type="button" onClick={async () => {
							await HandleTestAndSaveInstants()
					}} Icon={SiTestrail} title='Test Template' />
				</div>
			</form>
		</div>
	)
}

export default InstantsForm
