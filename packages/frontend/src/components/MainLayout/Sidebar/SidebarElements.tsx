// import { useEffect, useState } from "react"
// import { NavLink, useLocation } from "react-router-dom"

// const SidebarElement = ({ title , to, Icon, HandleToggleButton } : any) => {
//   const location = useLocation();
//   const [isPageActive, setIsPageActive] = useState(false);

//   useEffect(() => {
//     // Compare the current location path with the 'to' prop to determine if it's active
//     if (location.pathname === to) {
//       setIsPageActive(true);
//     } else {
//       setIsPageActive(false);
//     }
//   }, [location.pathname, to]); // This runs whenever location or 'to' changes

//   return (
//     <div >
//       <NavLink
//       onClick={HandleToggleButton}
//       to={to}
//       className={`flex pl-4 hover:bg-stone-200 w-full rounded p-1 text-sm text-stone-950 gap-2 items-center ${
//           isPageActive ? 'bg-white text-white shadow hover:' : ''
//         }`}
//     >
//       <Icon className={`${isPageActive ? 'text-violet-500' : 'text-gray-500'}`
//       }/>

//       {title}
//     </NavLink>

//     </div>
//   )
// }

import { useEffect, useState } from "react"
import { FiChevronDown } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom"

interface SubItem {
  title: string;
  to: string;
  Icon: any;
}

interface SidebarElementProps {
  title: string;
  to?: string; // Make 'to' optional for parent items with sub-items
  Icon: any;
  HandleToggleButton: () => void;
  subItems?: SubItem[];
}

const SidebarElement = ({ title, to, Icon, HandleToggleButton, subItems = [] }: SidebarElementProps) => {
  const location = useLocation();
  const [isPageActive, setIsPageActive] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  useEffect(() => {
    // Check if any sub-item's 'to' matches the current path or if the parent's 'to' matches
    const isActive = (to && location.pathname === to) || subItems.some((item) => location.pathname === item.to);
    setIsPageActive(isActive);
    // Auto-open submenu if a sub-item is active
    if (isActive && subItems.length > 0) {
      setIsSubMenuOpen(true);
    }
  }, [location.pathname, to, subItems]);

  const toggleSubMenu = () => {
    if (subItems.length > 0) {
      setIsSubMenuOpen(!isSubMenuOpen);
    }
  };

  return (
    <div>
      <div 
        className={`flex pl-4 hover:bg-stone-200 w-full rounded p-1 text-sm text-stone-950 gap-2 items-center cursor-pointer ${
          isPageActive ? 'bg-white shadow' : ''
        }`}
        onClick={toggleSubMenu}
      >
        <Icon className={`${isPageActive ? 'text-violet-500' : 'text-gray-500'}`} />
        {subItems.length > 0 || !to ? (
          <div className="flex gap-20 items-center">
          <span>{title}</span>
          <FiChevronDown />
          </div>
        ) : (
          <NavLink
            to={to}
            onClick={HandleToggleButton}
            className="flex-1"
          >
            {title}
          </NavLink>
        )}
      </div>
      {subItems.length > 0 && isSubMenuOpen && (
        <div className="ml-2">
          {subItems.map((subItem) => (
            <NavLink
              key={subItem.to}
              to={subItem.to}
              onClick={HandleToggleButton}
              className={`flex pl-4 hover:bg-stone-200 w-full rounded p-1 text-sm text-stone-950 gap-2 items-center whitespace-pre ${
                location.pathname === subItem.to ? 'bg-white shadow' : ''
              }`}
            >
              <subItem.Icon className={`${location.pathname === subItem.to ? 'text-violet-500' : 'text-gray-500'}`} />
              {subItem.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarElement