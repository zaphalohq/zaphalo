import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"

const SidebarElement = ({ title , to, Icon, HandleToggleButton } : any) => {
  const location = useLocation();
  const [isPageActive, setIsPageActive] = useState(false);

  useEffect(() => {
    // Compare the current location path with the 'to' prop to determine if it's active
    if (location.pathname === to) {
      setIsPageActive(true);
    } else {
      setIsPageActive(false);
    }
  }, [location.pathname, to]); // This runs whenever location or 'to' changes

  return (
    <div >
      <NavLink
      onClick={HandleToggleButton}
      to={to}
      className={`flex pl-4 hover:bg-stone-200 w-full rounded p-1 text-sm text-stone-950 gap-2 items-center ${
          isPageActive ? 'bg-white text-white shadow hover:' : ''
        }`}
    >
      <Icon className={`${isPageActive ? 'text-violet-500' : 'text-gray-500'}`
      }/>

      {title}
    </NavLink>

    </div>
  )
}

export default SidebarElement
