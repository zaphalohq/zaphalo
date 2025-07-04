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
  to?: string;
  Icon: any;
  HandleToggleButton: () => void;
  subItems?: SubItem[];
}

const SidebarElement = ({ title, to, Icon, HandleToggleButton, subItems = [] }: SidebarElementProps) => {
  const location = useLocation();
  const [isPageActive, setIsPageActive] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  useEffect(() => {
    const isActive = (to && location.pathname === to) || subItems.some((item) => location.pathname === item.to);
    setIsPageActive(isActive);
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
        className={`flex pl-4 hover-blacky p-2 w-full rounded text-sm text-gray-200 gap-2 items-center cursor-pointer ${isPageActive ? 'bg-blacky-light shadow' : ''
          }`}
        onClick={toggleSubMenu}
      >
        <Icon className={`${isPageActive ? 'text-violet-500' : 'text-violet-400'}`} />
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
              className={`flex pl-4 hover-blacky w-full rounded p-1.5 text-sm text-white gap-2 items-center whitespace-pre ${location.pathname === subItem.to ? 'bg-blacky-light shadow' : ''
                }`}
            >
              <subItem.Icon className={`${location.pathname === subItem.to ? 'text-violet-500' : 'text-violet-400'}`} />
              {subItem.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarElement