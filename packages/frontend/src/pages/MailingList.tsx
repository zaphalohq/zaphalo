import { useMutation } from "@apollo/client";
import { log } from "console";
import { useContext, useEffect, useState } from "react"
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { CREATE_MAILING_LIST } from "./Mutation/MailingList";

type MailingList = {
  contactName: string;
  contactNo: string;
};

const mailingList = () => {
  const [mailingList, setMailingList] = useState<MailingList[]>([
    { contactName: "", contactNo: "" }
  ]);

  const HandelAddButton = () => {
    setMailingList([...mailingList, { contactName: "", contactNo: "" }])
  }

  const HandelDeleteButton = (index: number) => {
    mailingList.splice(index, 1)
    setMailingList([...mailingList])
  }


  const HandleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedButtons = [...mailingList];
    const currentButton = updatedButtons[index];
    const field = e.target.name;
    const value = e.target.value;
    updatedButtons[index] = { ...currentButton, [field]: value };

    setMailingList(updatedButtons);
  };

    const [createMailingList, { data, loading, error }] = useMutation(CREATE_MAILING_LIST);

  const handleCreate = async () => {
    console.log(mailingList, 'mailing list ');
    
    try {
      const res = await createMailingList({
        variables: {
          mailingListInput: {
            mailingContacts: mailingList
          }
        },
      });

        console.log('Mailing List Created:', res.data.CreateMailingList);
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Mailing List</div>
    <div className="p-10 mt-4 bg-white rounded">
      <div onClick={HandelAddButton} className="flex text-lg font-semibold  items-center justify-end" >
        <div className="p-2 px-4 rounded hover:bg-violet-600 cursor-pointer bg-violet-500 text-white flex items-center justify-center gap-2">
          <span className="font-bold"><FiPlus /></span>
          <span>Add Button</span>
        </div>
      </div>
      <div className="flex flex-col gap-10 mt-6">
        {mailingList.map((currentButton, index) =>
          <div key={index} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={currentButton.contactName}
                onChange={(e: any) => HandleInputChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="John"
              />
            </div>
            <div>
              <div className="flex ">
                <label className=" flex-1 text-sm font-medium text-gray-700">Contact No</label>
                <div onClick={() => HandelDeleteButton(index)} className="p-1 text-red-500 hover:bg-red-400 cursor-pointer hover:text-white rounded"><FiTrash2 /></div>
              </div>
              <input
                key={index}
                type="number"
                name="contactNo"
                value={currentButton.contactNo}
                onChange={(e: any) => HandleInputChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="7202051718"
              />
            </div>
          </div>
        )}
      </div>
      <div onClick={handleCreate} className="flex text-lg font-semibold  items-center justify-center pt-8" >
        <div className="p-2 px-4 rounded hover:bg-violet-600 cursor-pointer bg-violet-500 text-white flex items-center justify-center gap-2">
          <span className="font-bold"></span>
          <span>Create Mailing List</span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default mailingList
