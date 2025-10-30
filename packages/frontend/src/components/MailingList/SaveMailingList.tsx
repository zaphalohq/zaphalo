import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useRecoilState } from "recoil";
import excel from "@src/assets/excel.png"
import { cookieStorage } from "@src/utils/cookie-storage";
import { Post } from "@src/modules/domain-manager/hooks/axios";
import { currentUserWorkspaceState } from "@src/modules/auth/states/currentUserWorkspaceState";
import { toast } from "react-toastify";

const SaveMailingList = ({setIsSaveMailingListVis}: any) => {
  const [error, setError] = useState<string>(null)
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mailingListName, setMailingListName] = useState("");
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
      setError('')

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mailingListName", mailingListName);
    try {
      const response = await Post(`/uploadExcel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
            
      if(response.data.success){
        setIsSaveMailingListVis(false);
        toast.success(response.data.message);
      }

    } catch (error) {
      const message =
        error?.response?.data?.message || "Unexpected error";
      setError(message)
    }
  };

  return (
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
        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <p className="text-red-700 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact List Name</h2>
        <input onChange={(e) => setMailingListName(e.target.value)} className='border-none outline-none bg-blue-50 w-full p-2 rounded' placeholder="Enter Contact List Name" type="text" name="mailingListName" />
        <h2 className="text-lg font-semibold text-gray-800 my-2">Upload Contact List</h2>

        <label className="flex mt-4 py-8 bg-chat flex-col mb-4 items-center justify-center border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx, .xls"
          />
          <div className="text-5xl font-extrabold text-green-500"><FiUpload /></div>
          <div className="bg-green-500 p-2 px-6 mt-4 rounded-full text-white font-semibold">Upload</div>
          <span className="text-gray-600 pt-4">{fileName || "Suppoted files: .xlsx, .xls"}</span>
        </label>

        {file && mailingListName && (
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
  )
}

export default SaveMailingList
