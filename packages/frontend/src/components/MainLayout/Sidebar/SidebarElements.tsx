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
      <divclassName={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
        isPageActive ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={toggleSubMenu}>
        {Icon}
        {subItems.length > 0 || !to ? (
          <div className="flex gap-20 items-center">
            <span>{title}</span>
            <FiChevronDown />
          </div>
          ) : (
          <NavLink
            to={to}
            onClick={HandleToggleButton}
            className="flex-1">
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
                className={`flex pl-6 hover-blacky w-full rounded p-2.5 text-sm text-white gap-2 items-center whitespace-pre ${location.pathname === subItem.to ? ' shadow' : ''
              }`}
            >
              {subItem.Icon}
              {subItem.title}
            </NavLink>
            ))}
          </div>
        )}
    </div>
  )
}

export default SidebarElement