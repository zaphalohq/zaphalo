import { useContext, useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { TemplateContext } from "@src/modules/whatsapp/Context/TemplateContext";

type ButtonData = {
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
};
type ButtonType = 'URL' | 'QUICK_REPLY' | 'PHONE_NUMBER';

const TemplateButton = ({ setTemplateData2 }: any) => {
  const { templateData, setTemplateData }: any = useContext(TemplateContext)
  const [addButtonData, setAddButtonData] = useState<ButtonData[]>(() => {
    if(templateData.button?.length > 0){
      return [...templateData.button]
    }else{
      return []
    }
  });

  const HandelAddButton = () => {
    setAddButtonData([...addButtonData, { text: "", type: "QUICK_REPLY" }])
  }

  const HandelDeleteButton = (index: number) => {
    addButtonData.splice(index, 1)
    setAddButtonData([...addButtonData])
  }

  useEffect(() => {
    setTemplateData((prev: any) => ({ ...prev, button: addButtonData }))
    setTemplateData((prev: any) => ({ ...prev, button: addButtonData }))
  }, [addButtonData])


  const HandleButtonChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedButtons = [...addButtonData];
    const currentButton = updatedButtons[index];
    const field = e.target.name;
    const value = e.target.value;

    if (field === 'type') {
      const newType = value as ButtonType;
      if (newType === 'URL') {
        updatedButtons[index] = { type: 'URL', text: currentButton.text, url: '' };
      } else if (newType === 'PHONE_NUMBER') {
        updatedButtons[index] = { type: 'PHONE_NUMBER', text: currentButton.text, phone_number: '' };
      } else if (newType === 'QUICK_REPLY') {
        updatedButtons[index] = { type: 'QUICK_REPLY', text: currentButton.text };
      }
    } else {
      updatedButtons[index] = { ...currentButton, [field]: value };
    }

    setAddButtonData(updatedButtons);
  };

    return (
    <div>
      <div onClick={HandelAddButton} className="flex text-lg font-semibold  items-center justify-end" >
        <div className="p-2 px-4 rounded hover:bg-green-600 cursor-pointer bg-green-500 text-white flex items-center justify-center gap-2">
          <span className="font-bold"><FiPlus /></span>
          <span>Add Button</span>
        </div>
      </div>

      <div className="flex flex-col gap-10 mt-6">
        {addButtonData.map((currentButton, index) =>
          <div key={index}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Type</label>
              <select
                name="type"
                value={currentButton.type}
                onChange={(e: any) => HandleButtonChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
              >
                <option value="QUICK_REPLY">QUICK_REPLY</option>
                <option value="URL">URL</option>
                <option value="PHONE_NUMBER">PHONE_NUMBER</option>
              </select>
            </div>

            <div>
              <div className="flex ">
                <label className=" flex-1 text-sm font-medium text-gray-700">Button Text</label>
                <div onClick={() => HandelDeleteButton(index)} className="p-1 text-red-500 hover:bg-red-400 cursor-pointer hover:text-white rounded"><FiTrash2 /></div>
              </div>
              <input
                key={index}
                type="text"
                name="text"
                value={currentButton.text}
                onChange={(e: any) => HandleButtonChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Learn More"
              />
            </div>

            {currentButton.type === 'URL' ? <div>
              <label className="block text-sm font-medium text-gray-700">Button URL</label>
              <input
                type="text"
                name="url"
                value={currentButton.url}
                onChange={(e: any) => HandleButtonChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="https://chatgpt.com/"
              />
            </div> : <></>}

            {currentButton.type === 'PHONE_NUMBER' ? <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="number"
                name="phone_number"
                value={currentButton.phone_number}
                onChange={(e: any) => HandleButtonChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="phone no"
              />
            </div> : <></>}
          </div>
        )}
      </div>
    </div>
  )


}

export default TemplateButton
