
import { Outlet } from "react-router-dom"
import { useState } from "react"
import Sidebar from "../components/MainLayout/Sidebar/Sidebar"
import Navbar from "../components/MainLayout/Navbar/Navbar"

const MainLayout = () => {
  const [isToggleActivated, setIsToggleActivated] = useState(false)
  const HandleToggleButton = () => {
    setIsToggleActivated(!isToggleActivated)
  }
  return (
    <div className='grid gap-4 md:grid-cols-[220px_1fr] p-4'>
      <Sidebar HandleToggleButton={HandleToggleButton} isToggleActivated={isToggleActivated} />
      <div >
      <div className={`${isToggleActivated ? 'hidden md:block overflow-x-auto' : 'overflow-x-auto'}`}>
        <Navbar HandleToggleButton={HandleToggleButton} />
        <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout