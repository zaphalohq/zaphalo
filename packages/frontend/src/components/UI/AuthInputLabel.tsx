
const AuthInputLabel = ({ name, title , HandleChange, placeholder} : any) => {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{title}</label>
    <input  name={name}
            onChange={HandleChange}
              type="username"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder={placeholder}
              required
            />
    </div>
  )
}

export default AuthInputLabel
