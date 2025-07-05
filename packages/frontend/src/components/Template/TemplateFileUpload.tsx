import React, { useState } from 'react'
import axios from 'axios'

const TemplateFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (file !== null) {

      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/templateFileUpload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Upload Image to WhatsApp</h2>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className={`w-full py-2 px-4 rounded text-white bg-blue-500 hover:bg-blue-600`}
        >
          upload File
        </button>
        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}
      </div>
    </div>
  )
}

export default TemplateFileUpload
