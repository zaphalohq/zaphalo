// import { useMutation } from "@apollo/client";
// import { log } from "console";
// import { useContext, useEffect, useState } from "react"
// import { FiPlus, FiTrash2 } from "react-icons/fi";
// import { CREATE_MAILING_LIST } from "./Mutation/MailingList";

// type MailingList = {
//   contactName: string;
//   contactNo: string;
// };

// const mailingList = () => {
//   const [mailingList, setMailingList] = useState<MailingList[]>([
//     { contactName: "", contactNo: "" }
//   ]);

//   const HandelAddButton = () => {
//     setMailingList([...mailingList, { contactName: "", contactNo: "" }])
//   }

//   const HandelDeleteButton = (index: number) => {
//     mailingList.splice(index, 1)
//     setMailingList([...mailingList])
//   }


//   const HandleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const updatedButtons = [...mailingList];
//     const currentButton = updatedButtons[index];
//     const field = e.target.name;
//     const value = e.target.value;
//     updatedButtons[index] = { ...currentButton, [field]: value };

//     setMailingList(updatedButtons);
//   };

//     const [createMailingList, { data, loading, error }] = useMutation(CREATE_MAILING_LIST);

//   const handleCreate = async () => {
//     console.log(mailingList, 'mailing list ');

//     try {
//       const res = await createMailingList({
//         variables: {
//           mailingListInput: {
//             mailingContacts: mailingList
//           }
//         },
//       });

//         console.log('Mailing List Created:', res.data.CreateMailingList);
//     } catch (err) {
//       console.error(err);
//     }
//   }


//   return (
//     <div>
//       <div className='font-bold text-lg border-gray-300 p-4 border-b'>Mailing List</div>
//     <div className="p-10 mt-4 bg-white rounded">
//       <div onClick={HandelAddButton} className="flex text-lg font-semibold  items-center justify-end" >
//         <div className="p-2 px-4 rounded hover:bg-violet-600 cursor-pointer bg-violet-500 text-white flex items-center justify-center gap-2">
//           <span className="font-bold"><FiPlus /></span>
//           <span>Add Button</span>
//         </div>
//       </div>
//       <div className="flex flex-col gap-10 mt-6">
//         {mailingList.map((currentButton, index) =>
//           <div key={index} className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Contact Name</label>
//               <input
//                 type="text"
//                 name="contactName"
//                 value={currentButton.contactName}
//                 onChange={(e: any) => HandleInputChange(index, e)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
//                 placeholder="John"
//               />
//             </div>
//             <div>
//               <div className="flex ">
//                 <label className=" flex-1 text-sm font-medium text-gray-700">Contact No</label>
//                 <div onClick={() => HandelDeleteButton(index)} className="p-1 text-red-500 hover:bg-red-400 cursor-pointer hover:text-white rounded"><FiTrash2 /></div>
//               </div>
//               <input
//                 key={index}
//                 type="number"
//                 name="contactNo"
//                 value={currentButton.contactNo}
//                 onChange={(e: any) => HandleInputChange(index, e)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
//                 placeholder="7202051718"
//               />
//             </div>
//           </div>
//         )}
//       </div>
//       <div onClick={handleCreate} className="flex text-lg font-semibold  items-center justify-center pt-8" >
//         <div className="p-2 px-4 rounded hover:bg-violet-600 cursor-pointer bg-violet-500 text-white flex items-center justify-center gap-2">
//           <span className="font-bold"></span>
//           <span>Create Mailing List</span>
//         </div>
//       </div>
//     </div>
//     </div>
//   )
// }

// export default mailingList


import { useState } from "react";
import axios from 'axios';
import excel from "@src/assets/excel.png"
import { FiUpload } from "react-icons/fi";
import { cookieStorage } from "@src/utils/cookie-storage";
import { useRecoilState } from "recoil";
import { currentUserWorkspaceState } from "@src/modules/auth/states/currentUserWorkspaceState";
// import fdf from "../../public/"
// import fdf from "../assets/sample_contacts.xlsx"
const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [currentUserWorkspace] = useRecoilState(currentUserWorkspaceState);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const  workspaceId = currentUserWorkspace?.id;
    
    const accessToken = cookieStorage.getItem('accessToken')
    const authtoken = accessToken ? JSON.parse(accessToken).accessToken : false;
console.log(authtoken,'accessTokenaccessTokenaccessToken');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/uploadExcel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${authtoken.token}`,
          "x-workspace-id": workspaceId,
        },
      });

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Mailing List</div>
      <div className="flex items-center justify-between mt-10 px-20">
        <div className=" mx-auto p-4 px-6 max-w-md shadow-xl rounded-xl bg-light ">
          <div className="py-2 font-semibold text-lg">Sample Excel</div>
          <img className="rounded" src={excel} alt="" />
          <div className=" text-gray-900 py-4">The excel sheet should contain only two columns with the same column  name like this
            <span className="text-black font-semibold pl-1">"contactName" </span>
            & <span className="text-black font-semibold">"contactNo"</span> .
          </div>
          <a className="text-blue-600 underline pr-1" href="/sample_contacts.xlsx" download="sample_contacts.xlsx">
            Download
          </a>
          sample excel sheet
        </div>
        <div className="w-full max-w-md mx-auto p-6 bg-light shadow-lg rounded-xl">
          <h2 className="text-lg font-semibold text-gray-800">Upload Contact List</h2>

          <label className="flex mt-4 py-10 bg-chat flex-col mb-4 items-center justify-center border-2 border-dashed border-violet-300 rounded-lg cursor-pointer hover:border-violet-500 transition-colors">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx, .xls"
            />
            <div className="text-5xl font-extrabold text-violet-500"><FiUpload /></div>
            <div className="bg-violet-500 p-2 px-6 mt-4 rounded-full text-white font-semibold">Browse</div>
            <span className="text-gray-600 pt-4">{fileName || "Suppoted files: .xlsx, .xls"}</span>
          </label>

          {file && (
            <div className=" text-sm text-gray-700">
              <p><strong>Selected:</strong> {file.name}</p>
              <button
                onClick={handleUpload}
                className="mt-3 px-4 py-2 w-full bg-violet-500 cursor-pointer text-white text-lg rounded hover:bg-violet-600"
              >
                Upload
              </button>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

