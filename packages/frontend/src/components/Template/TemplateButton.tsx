import { log } from "console";
import { useEffect, useState } from "react"
import { FiPlus, FiTrash2 } from "react-icons/fi";

const TemplateButton = ({ setTemplateData }: any) => {
  const [addButtonData, setAddButtonData] = useState([
    { buttonText: "", buttonUrl: "" }
  ]);

  const HandelAddButton = () => {
    setAddButtonData([...addButtonData, { buttonText: "", buttonUrl: "" }])
  }

  const HandelDeleteButton = (index : number) => {
      addButtonData.splice(index,1)
      setAddButtonData([...addButtonData])
  }

  useEffect(() => {
    setTemplateData((prev: any) => ({ ...prev, button: addButtonData }))
  }, [addButtonData])

  const HandleButtonChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const copyaddButtonData = [...addButtonData];
    const updatedButtonObj = {
      ...copyaddButtonData[index],
      [e.target.name]: e.target.value,
    };

    copyaddButtonData[index] = updatedButtonObj;
    setAddButtonData(copyaddButtonData);
  };

  return (
    <div>
      <div onClick={HandelAddButton} className="flex text-lg font-semibold  items-center justify-end" >
        <div className="p-2 px-4 rounded hover:bg-violet-600 cursor-pointer bg-violet-500 text-white flex items-center justify-center gap-2">
          <span className="font-bold"><FiPlus /></span>
          <span>Add Button</span>
          </div>
      </div>
      {/* <button onClick={handelAddButton} className="bg-gray-200 p-2 rounded cursor-pointer hover:bg-violet-600 text-gray-800 ">Add New Button</button>
      <button onClick={handelDeleteButton} className="bg-violet-500 p-2 rounded cursor-pointer hover:bg-violet-600 text-white ">Delete Button</button> */}
      <div className="flex flex-col gap-10 mt-6">
        {addButtonData.map((button, index) =>
          <div key={index}>
            <div>
              <div className="flex ">
              <label className=" flex-1 text-sm font-medium text-gray-700">Button Text (Optional)</label>
              <div onClick={() => HandelDeleteButton(index)} className="p-1 text-red-500 hover:bg-red-400 cursor-pointer hover:text-white rounded"><FiTrash2 /></div>
              </div>
              <input
                key={index}
                type="text"
                name="buttonText"
                value={addButtonData[index].buttonText}
                onChange={(e: any) => HandleButtonChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Learn More"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Button URL (Optional)</label>
              <input
                type="text"
                name="buttonUrl"
                value={addButtonData[index].buttonUrl}
                onChange={(e: any) => HandleButtonChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="https://chatgpt.com/"
              />
            </div>





















            {/* 
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Text (Optional)</label>
              <input
                key={index}
                type="text"
                name="buttonText"
                value={templateData[index].buttonText}
                // name="a1"
                // value={abc[1].a1}
                // onChange={handleInputChange}
                onChange={(e : any ) => handleChange(1, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Learn More"
              />
            </div> */}
            {/* 
            <div>
              <label className="block text-sm font-medium text-gray-700">Button URL (Optional)</label>
              <input
                type="text"
                name="a2"
                onChange={(e : any ) => handleChange(1, e)}
                value={abc.a2}
                // name={button.buttonUrl}
                // value={templateData.buttonUrl}
                // onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="https://chatgpt.com/"
              />
            </div> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateButton
