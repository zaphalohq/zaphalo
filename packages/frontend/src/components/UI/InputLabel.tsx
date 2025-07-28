
const InputLabel = ({ name, value, title, type, placeholder, HandleInputChange, required }: any) => {
  return (
    <div>
      <label className="block text-stone-600 font-semibold pb-1" htmlFor="">{title}</label>
      <input {...(required ? { required: true } : {})} name={name} type={type ? type : undefined} value={value ? value : undefined} onChange={HandleInputChange} className="block w-full bg-stone-200 p-2  outline-none rounded-lg" placeholder={placeholder} required />
    </div>
  )
}

export default InputLabel
