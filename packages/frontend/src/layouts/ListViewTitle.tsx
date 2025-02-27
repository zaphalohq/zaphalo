import React, { useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import WhatsappInstants from '../components/pages/WhatsappInstants'

const ListViewTitle = () => {
    // const [ isPopUpActive, setIsPopUpActive ] = useState(false)
    // const HandlePopUp = () => {
    //     setIsPopUpActive(!isPopUpActive)
    // }
  return (
<div>
    <div className="relative overflow-x-auto pt-4">
    <table className="w-full text-sm text-left rtl:text-right text-stone-500 rounded-2xl">
        <thead className="text-xs text-stone-700 uppercase bg-stone-200 ">
            <tr>
                <th scope="col" className="px-6 py-3">
                Name
                </th>
                <th scope="col" className="px-6 py-3">
                App ID
                </th>
                <th scope="col" className="px-6 py-3">
                Phone Number ID
                </th>
                <th scope="col" className="px-6 py-3">
                Business Account ID
                </th>
                <th scope="col" className="px-6 py-3">
                Access Token
                </th>
                <th scope="col" className="px-6 py-3">
                App Secret
                </th>
                <th scope="col" className="px-6 py-3 text-violet-500">
                Edit
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b   border-stone-200">
                <th scope="row" className="px-6 py-4 font-medium text-stone-900 whitespace-nowrap ">
                    Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4">
                    $1999
                </td>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-4 py-2">
                <button className='text-lg text-violet-500 cursor-pointer hover:bg-stone-200 p-2 rounded'><FiEdit2 /></button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
{/* <WhatsappInstants /> */}
</div>
  )
}

export default ListViewTitle
