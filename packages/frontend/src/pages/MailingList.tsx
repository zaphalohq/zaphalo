import { useState } from "react";
import axios from 'axios';
import { FiUpload } from "react-icons/fi";
import { useRecoilState } from "recoil";
import excel from "@src/assets/excel.png"
import { cookieStorage } from "@src/utils/cookie-storage";
import { currentUserWorkspaceState } from "@src/modules/auth/states/currentUserWorkspaceState";

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
    const workspaceId = currentUserWorkspace?.id;
    const accessToken = cookieStorage.getItem('accessToken')
    const authtoken = accessToken ? JSON.parse(accessToken).accessToken : false;
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/uploadExcel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${authtoken.token}`,
          "x-workspace-id": workspaceId,
        },
      });

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

