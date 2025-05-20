const TemplateBody = ({templateData, handleInputChange } : any) => {
  return (
    <div>
      <div className="border border-gray-300">
              {/* <label className="block text-sm font-medium text-gray-700">Body Text</label> */}
              <textarea
                name="bodyText"
                value={templateData.bodyText}
                onChange={handleInputChange}
                className="mt-1 block w-full h-[30vh] rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Hello {{1}}, thank you for joining!"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Body Example Text (Optional)</label>
              <input
                type="text"
                name="body_text"
                value={templateData.body_text}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2"
                placeholder="Chintan Patel"
              />
            </div> */}
    </div>
  )
}

export default TemplateBody
