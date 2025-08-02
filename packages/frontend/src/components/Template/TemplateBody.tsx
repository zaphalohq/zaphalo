const TemplateBody = ({ templateData, handleInputChange }: any) => {
  return (
    <div>
      <div className="border border-gray-300">
        <textarea
          name="bodyText"
          value={templateData.bodyText}
          onChange={handleInputChange}
          className="mt-1 block w-full h-[30vh] rounded-md border-gray-300 shadow-sm outline-none p-2"
          placeholder="Hello {{1}}, thank you for joining!"
          required
        />
      </div>
    </div>
  )
}

export default TemplateBody
