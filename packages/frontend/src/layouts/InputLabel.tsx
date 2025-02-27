
const InputLabel = ({ name, value, title, placeholder, HandleChange} : any) => {
  return (
    <div>
      <label className="block text-stone-600 font-semibold pb-1" htmlFor="">{title}</label>
      <input name={name} value={value} onChange={HandleChange} className="block w-full border-b border-stone-300 bg-stone-200 p-2   outline-none rounded-lg" type="text" placeholder={placeholder} />
    </div>
  )
}

export default InputLabel
