import React, { useContext } from 'react'
import { TemplateContext } from '../Context/TemplateContext'

const TemplateHeader = ({ templateData, handleInputChange, handleFileChange }: any) => {
  const { selectedTemplateInfo }: any = useContext(TemplateContext);

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Header Type</label>
        <select
          name="headerType"
          value={templateData.headerType}
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

      {templateData.headerType === 'TEXT' ?
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-4">Header Text</label>
          <input
            required
            type="text"
            name="headerText"
            value={templateData.headerText}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
            placeholder="Welcome to Our Service"
          />
        </div>
        :
        <></>
      }

      {templateData.headerType === 'IMAGE' ?
        <>
          <label className="block text-sm font-medium text-gray-700 mt-4 pb-2">Upload image</label>
          {selectedTemplateInfo.templateOriginaName ?
            <p className='p-2 mb-2 text-blue-700 rounded bg-blue-500/10 font-semibold'>
              <span className='text-gray-600 font-normal'>Current Uploaded Image : </span>
              {selectedTemplateInfo.templateOriginaName}
            </p> : <></>}
          <input
            type="file"
            name="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          /></>
        :
        <></>
      }

      {templateData.headerType === 'VIDEO' ?
        <>
          <label className="block text-sm font-medium text-gray-700 mt-4">Upload image</label>
          <input
            type="file"
            name="header_handle"
            accept=".mp4,.3gp"
            onChange={handleFileChange}
            className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          /></>
        :
        <></>
      }
    </div>
  )
}

export default TemplateHeader
