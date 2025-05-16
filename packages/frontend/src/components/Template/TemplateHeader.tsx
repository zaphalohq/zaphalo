import React from 'react'

const TemplateHeader = ({templateData, handleInputChange, handleFileChange } : any) => {
  return (
    <div>
       <div>
              <label className="block text-sm font-medium text-gray-700">Header</label>
              <select
                name="headerFormat"
                value={templateData.headerFormat}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              >
                <option value="NONE">None</option>
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>

            {templateData.headerFormat === 'TEXT' ?
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-4">Header Text (Optional)</label>
                <input
                  type="text"
                  name="header_handle"
                  value={templateData.header_handle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                  placeholder="Welcome to Our Service"
                />
              </div>
              :
              <></>
            }

            {templateData.headerFormat === 'IMAGE' ?
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4 pb-2">Upload image</label>
                <input
                  type="file"
                  name="imageUrl"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                /></>
              :
              <></>
            }

            {templateData.headerFormat === 'VIDEO' ?
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">Upload image</label>
                <input
                  type="file"
                  name="imageUrl"
                  accept=".mp4,.3gp"
                  onChange={handleFileChange}
                  className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                /></>
              :
              <></>
            }

            {/* {templateData.headerFormat === 'DOCUMENT' ?
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">Upload image</label>
                <input
                  type="file"
                  name="imageUrl"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                /></>
              :
              <></>
            } */}
    </div>
  )
}

export default TemplateHeader
