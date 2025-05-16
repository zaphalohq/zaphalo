const TemplateFooter = ({ templateData, handleInputChange}: any) => {
  return (
    <div>
      <div>
              <label className="block text-sm font-medium text-gray-700 mt-2">Footer Text (Optional)</label>
              <input
                type="text"
                name="footerText"
                value={templateData.footerText}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Contact us for support"
              />
            </div>
    </div>
  )
}

export default TemplateFooter
