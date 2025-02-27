import { ChangeEvent, useState } from "react"
import InputLabel from "../../layouts/InputLabel"
import SubmitButton from "../../layouts/SubmitButton"
import { useMutation } from "@apollo/client"
import { WhatsappInstantsData } from "./Mutation/WhatsappInstants"
import ListViewTitle from "../../layouts/ListViewTitle"

const WhatsappInstants = () => {
  const [formData, setFormData ] = useState({
    name : '',
    appId: '',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    appSecret: ''
  })

const [ InstantsSubmission ] = useMutation(WhatsappInstantsData);

  const HandleChange = (e: ChangeEvent<HTMLInputElement>) => {
  
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name] : value
    })
  }
  const HandleClick = async () => {
console.log(formData);
 try {
  await InstantsSubmission({
  variables : {
    ...formData
  }
 })

} catch (err) {
  console.error('Error submitting form', err);
}
  }
  return (
    <div className="h-screen">
    <div>
      <ListViewTitle />
    </div>
    <div className="fixed inset-0 bg-stone-900/30 flex justify-center items-center ">
        <div className="grid md:grid-cols-2 gap-4 pt-7 md:px-4 ">
        <InputLabel name='name' value={formData.name} HandleChange={HandleChange} title="Name" placeholder="eg: ConstroERP" />
        <InputLabel name='appId' value={formData.appId} HandleChange={HandleChange} title="App ID" placeholder="App ID" />
        <InputLabel name='phoneNumberId' value={formData.phoneNumberId} HandleChange={HandleChange} title="Phone Number ID" placeholder="Phone Number ID" />
        <InputLabel name='businessAccountId' value={formData.businessAccountId} HandleChange={HandleChange} title="Business Account ID" placeholder="Business Account ID" />
        <InputLabel name='accessToken' value={formData.accessToken} HandleChange={HandleChange} title="Access Token" placeholder="Access Token" />
        <InputLabel name='appSecret' value={formData.appSecret} HandleChange={HandleChange} title="App Secret" placeholder="App Secret" />
        <SubmitButton HandleClick={HandleClick} title='Sync Template' />
        </div>
    </div>
    </div>
  )
}

export default WhatsappInstants
