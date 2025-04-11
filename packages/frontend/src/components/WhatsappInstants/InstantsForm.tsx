import { useContext } from "react"
import { InstantsContext } from "../Context/InstantsContext"
import InputLabel from "../UI/InputLabel"
import SubmitButton from "../UI/SubmitButton"
import { FaSyncAlt } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import CloseButton from "../UI/CloseButton"

const InstantsForm = () => {
    const {
        setIsNewInstants,
        HandleFormVisibility,
        HandleFormData,
        HandaleFeatchData,
        formData,
        HandleInputChange
    } : any = useContext(InstantsContext)
  return (
    <div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center">
				<CloseButton onClick={() => {
					setIsNewInstants(false)
					HandleFormVisibility()
				}} right="right-60" top="top-40" />
				<form  onSubmit={async () => {
						await HandleFormData()
						HandleFormVisibility()
						HandaleFeatchData()
						setIsNewInstants(false)
					}}
				className=" grid grid-cols-2 place-content-center px-8 gap-4 w-[60%] h-[45%] bg-stone-50 rounded-lg ">
					<InputLabel type="text" name='name' value={formData.name} HandleInputChange={HandleInputChange} title="Name" placeholder="eg: ConstroERP" />
					<InputLabel type="text" name='appId' value={formData.appId} HandleInputChange={HandleInputChange} title="App ID" placeholder="App ID" />
					<InputLabel type="text" name='phoneNumberId' value={formData.phoneNumberId} HandleInputChange={HandleInputChange} title="Phone Number ID" placeholder="Phone Number ID" />
					<InputLabel type="text" name='businessAccountId' value={formData.businessAccountId} HandleInputChange={HandleInputChange} title="Business Account ID" placeholder="Business Account ID" />
					<InputLabel type="text" name='accessToken' value={formData.accessToken} HandleInputChange={HandleInputChange} title="Access Token" placeholder="Access Token" />
					<InputLabel type="password" name='appSecret' value={formData.appSecret} HandleInputChange={HandleInputChange} title="App Secret" placeholder="App Secret" />
					<SubmitButton type="submit" Icon={FaSyncAlt} title='Sync Template' />
				</form>
			</div>
  )
}

export default InstantsForm
