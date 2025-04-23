
const MetricsCards = ({ title , total, Icon, baseColor, textColor} : any) => {
  return (
    <div className={`${baseColor} p-4 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${textColor}`}>{title}</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            {Icon}
          </div>
        </div>
  )
}

export default MetricsCards
