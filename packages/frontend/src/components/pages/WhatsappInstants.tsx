import { ChangeEvent, useEffect, useState } from "react"
import InputLabel from "../../layouts/InputLabel"
import SubmitButton from "../../layouts/SubmitButton"
import { useMutation, useQuery } from "@apollo/client"
import { findAllInstants, WhatsappInstantsCreation } from "./Mutation/WhatsappInstants"
import ListViewTitle from "../../layouts/ListViewTitle"
import { FiX } from "react-icons/fi"

const WhatsappInstants = () => {
  const [formData, setFormData ] = useState({
    name : '',
    appId: '',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    appSecret: ''
  })

const [ InstantsSubmission ] = useMutation(WhatsappInstantsCreation);
const { data, loading, error}  = useQuery(findAllInstants)
const [ instantsData, setInstantsData ] = useState([])
const [ isFormVisible, setFormVisibility ] = useState(false);

const HandleFormVisibility = () => {
  setFormVisibility(!isFormVisible)
}
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

  const HandaleData = async ( ) =>{
    console.log(".....");
    
    try {
      // const data1 = await data
      // console.log(data1)
      setInstantsData(await data.findAllInstants)
      
    } catch (err) {
      console.error('Error fetching data', err)
    }
  }

useEffect(() => {
  HandaleData()
}, [])


  return (
    <div className="h-screen">
    <div>
      <ListViewTitle instantsData={instantsData} HandleFormVisibility={HandleFormVisibility} />
    </div>
    <button onClick={HandaleData} className="bg-black">Buttoon</button>
    { isFormVisible ? <div className="fixed inset-0 bg-stone-900/30 flex items-center justify-center">
    <div className="absolute right-60 top-40 p-0.5 "><button onClick={HandleFormVisibility} className="cursor-pointer hover:bg-stone-200 text-3xl rounded-full p-1 text-center text-violet-500 bg-stone-50"><FiX /></button></div>
        <div className="grid md:grid-cols-2 gap-4  md:px-4 w-[60%] h-[50%]  bg-stone-50 p-4 rounded-lg">
        <InputLabel name='name' value={formData.name} HandleChange={HandleChange} title="Name" placeholder="eg: ConstroERP" />
        <InputLabel name='appId' value={formData.appId} HandleChange={HandleChange} title="App ID" placeholder="App ID" />
        <InputLabel name='phoneNumberId' value={formData.phoneNumberId} HandleChange={HandleChange} title="Phone Number ID" placeholder="Phone Number ID" />
        <InputLabel name='businessAccountId' value={formData.businessAccountId} HandleChange={HandleChange} title="Business Account ID" placeholder="Business Account ID" />
        <InputLabel name='accessToken' value={formData.accessToken} HandleChange={HandleChange} title="Access Token" placeholder="Access Token" />
        <InputLabel name='appSecret' value={formData.appSecret} HandleChange={HandleChange} title="App Secret" placeholder="App Secret" />
        <SubmitButton HandleClick={HandleClick} title='Sync Template' />
        </div>
    </div> : null}
    </div>
  )
}

export default WhatsappInstants
