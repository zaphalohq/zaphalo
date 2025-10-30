import React from 'react'

const DashboardContacts = ({contacts}) => {
  return (
    <>
      <div className="bg-white p-4 rounded-md border">
        <h3 className="font-semibold mb-3">Contacts</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">Total contacts</div>
          <div className="text-lg font-bold">{contacts?.length || 0}</div>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {contacts?.slice(0, 6).map((ct) => (
            <div key={ct.id} className="flex items-center gap-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                {ct.profileImg ?
                  <img className='w-full h-full object-cover rounded-full'
                    src={ct.profileImg} alt="dfssdf" />
                  : <div className="h-full w-full bg-blue-200 rounded-full flex justify-center text-blue-500 font-bold text-lg items-center">
                    {ct.contactName?.slice(0, 1).toUpperCase()}
                  </div>
                }
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{ct.contactName}</div>
                <div className="text-xs text-gray-500">{ct.phoneNo}</div>
              </div>
              <div className="text-xs text-gray-500">{ct.lastSeen}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default DashboardContacts
