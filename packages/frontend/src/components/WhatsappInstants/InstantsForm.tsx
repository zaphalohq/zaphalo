import { useContext } from "react"
import { InstantsContext } from "@Context/InstantsContext"
import InputLabel from "@UI/InputLabel"
import SubmitButton from "@UI/SubmitButton"
import { FaSyncAlt } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import CloseButton from "@UI/CloseButton"
import { FaSave } from "react-icons/fa";
import { SiTestrail } from "react-icons/si";

const InstantsForm = () => {
    const {
        setIsNewInstants,
        HandleFormVisibility,
        HandleCreateInstants,
        HandaleFeatchData,
        formData,
        HandleInputChange,
		HandleSyncAndSaveInstants,
		HandleTestAndSaveInstants
    } : any = useContext(InstantsContext)
  return (
    <div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center">
				<CloseButton onClick={() => {
					setIsNewInstants(false)
					HandleFormVisibility()
				}} right="right-60" top="top-40" />
				<form className="grid grid-cols-2 place-content-center px-8 gap-4 w-[60%] h-[45%] bg-stone-50 rounded-lg ">
					<InputLabel type="text" name='name' value={formData.name} HandleInputChange={HandleInputChange} title="Name" placeholder="eg: ConstroERP" />
					<InputLabel type="text" name='appId' value={formData.appId} HandleInputChange={HandleInputChange} title="App ID" placeholder="App ID" />
					<InputLabel type="text" name='phoneNumberId' value={formData.phoneNumberId} HandleInputChange={HandleInputChange} title="Phone Number ID" placeholder="Phone Number ID" />
					<InputLabel type="text" name='businessAccountId' value={formData.businessAccountId} HandleInputChange={HandleInputChange} title="Business Account ID" placeholder="Business Account ID" />
					<InputLabel type="text" name='accessToken' value={formData.accessToken} HandleInputChange={HandleInputChange} title="Access Token" placeholder="Access Token" />
					<InputLabel type="password" name='appSecret' value={formData.appSecret} HandleInputChange={HandleInputChange} title="App Secret" placeholder="App Secret" />
					<div className="grid grid-cols-3 col-span-2 gap-4">
					<SubmitButton type="button" onClick={async () => {
						await HandleCreateInstants()
						HandleFormVisibility()
						HandaleFeatchData()
						setIsNewInstants(false)
					}} Icon={FaSave} title='Save Template' />
					<SubmitButton type="button" onClick={async () => {
						await HandleSyncAndSaveInstants()
						HandleFormVisibility()
						HandaleFeatchData()
						setIsNewInstants(false)
					}} Icon={FaSyncAlt} title='Sync & Save Template' />
					<SubmitButton type="button" onClick={async () => {
						await HandleTestAndSaveInstants()
						HandleFormVisibility()
						HandaleFeatchData()
						setIsNewInstants(false)
					}} Icon={SiTestrail} title='Test & Save Template' />
					</div>
				</form>
			</div>
  )
}

export default InstantsForm
