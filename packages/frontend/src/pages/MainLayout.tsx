
import { Outlet, useLocation } from "react-router-dom"
import { useState } from "react"
import Sidebar from "@components/MainLayout/Sidebar/Sidebar"
import Navbar from "@components/MainLayout/Navbar/Navbar"

// const MainLayout = () => {
//   const [isToggleActivated, setIsToggleActivated] = useState(false)
//   const HandleToggleButton = () => {
//     setIsToggleActivated(!isToggleActivated)
//   }
//   const location = useLocation();
//   return (
//     <div className='grid gap-4 md:grid-cols-[220px_1fr] p-4'>
//       <Sidebar HandleToggleButton={HandleToggleButton} isToggleActivated={isToggleActivated} />
//       <div >
//       <div className={`${isToggleActivated ? 'hidden md:block overflow-x-auto' : 'overflow-x-auto'}`}>
//         {location.pathname == '/chats' ? <></> 
//                 :<Navbar HandleToggleButton={HandleToggleButton} location={location} />}
//         <Outlet />
//         </div>
//       </div>
//     </div>
//   )
// }


const MainLayout = () => {
  const [isToggleActivated, setIsToggleActivated] = useState(false)
  const HandleToggleButton = () => {
    setIsToggleActivated(!isToggleActivated)
  }
  const location = useLocation();
  return (
    <div className="grid md:grid-cols-[260px_1fr] min-h-screen w-full bg-blacky-900 p-5 overflow-hidden ">
      {/* Sidebar */}
      <Sidebar HandleToggleButton={HandleToggleButton} isToggleActivated={isToggleActivated} />
      
      {/* Main Content */}
      <div className="w-full overflow-hidden  rounded-2xl">
        <div className={`${isToggleActivated ? 'hidden md:block' : 'md:block'} md:block w-full h-full`}>
        {/* <Navbar HandleToggleButton={HandleToggleButton} location={location} />
          {location.pathname !== '/chats' ? <Navbar HandleToggleButton={HandleToggleButton} location={location} />
           : <div className="md:hidden"><Navbar HandleToggleButton={HandleToggleButton} location={location} /></div>
           }
           */}
          {/* Outlet takes full width and prevents overflow */}
          <div className="w-full h-full overflow-hidden bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout


// export default MainLayout