import AccountSelection from "./AccountSelection"
import LanguageCode from "./LanguageCode"
import TemplateFooter from "./TemplateFooter"
import TemplateHeader from "./TemplateHeader"

const TemplateBasic = ({ templateData, handleInputChange, handleFileChange }: any) => {
  return (
    <div>
      <AccountSelection templateData={templateData} handleInputChange={handleInputChange} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mt-4">Template Name</label>
        <input
          type="text"
          name="name"
          value={templateData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md outline-none shadow-sm p-2"
          placeholder="welcome_message"
          required
        />
      </div>


      <div className="grid grid-cols-2 gap-8 my-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={templateData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="UTILITY">Utility</option>
            <option value="MARKETING">Marketing</option>
            <option value="AUTHENTICATION">Authentication</option>
          </select>
        </div>
        <LanguageCode templateData={templateData} handleInputChange={handleInputChange} />
      </div>
      <TemplateHeader templateData={templateData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />
      <TemplateFooter templateData={templateData} handleInputChange={handleInputChange} />
    </div>
  )
}

export default TemplateBasic
