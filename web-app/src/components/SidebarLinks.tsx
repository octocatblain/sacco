import { FC } from "react";
import { NavLink } from "react-router-dom";
// components
import LucideIcon from "./LucideIcon";

interface SidebarLinksProps {
  onClick?: () => void;
  collapsed?: boolean; // when true, show icon-only (tooltip-like) sidebar
}

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "BarChart4",
    to: "/",
  },
  {
    label: "Customers",
    icon: "Users",
    to: "/customers",
  },
  {
    label: "Accounts",
    icon: "CreditCard",
    to: "/accounts",
  },
  {
    label: "Transactions",
    icon: "Wallet",
    to: "/transactions",
  },
  {
    label: "Loans",
    icon: "Wallet",
    to: "/loans",
  },
  {
    label: "Users",
    icon: "Users",
    to: "/users",
  },
  {
    label: "Settings",
    icon: "Settings",
    to: "/settings",
  },
  {
    label: "Help",
    icon: "CircleHelp",
    to: "/help",
  },
];
const SidebarLinks: FC<SidebarLinksProps> = ({
  onClick,
  collapsed = false,
}) => {
  return (
    <ul className={`space-y-2 ${collapsed ? "px-2" : ""}`}>
      {sidebarItems.map((item) => (
        <li key={item.label}>
          <NavLink
            to={item.to}
            onClick={onClick}
            className={({ isActive }) =>
              `group flex items-center ${
                collapsed ? "justify-center" : "justify-start"
              } gap-x-3 py-2.5 ${
                collapsed ? "px-2" : "px-3"
              } rounded-md text-sm md:text-base transition-all duration-200
               bg-white text-slate-800 hover:bg-slate-100
               dark:bg-blue-900 dark:text-slate-200 dark:hover:bg-blue-800
               border border-transparent dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-primary/60
               ${isActive ? "shadow-sm ring-1 ring-primary/40" : ""}`
            }
          >
            <span
              className={`inline-flex items-center justify-center ${
                collapsed ? "w-8 h-8" : "w-6 h-6"
              }`}
            >
              <LucideIcon name={item.icon} />
            </span>
            {!collapsed && (
              <span className="flex-1 truncate">{item.label}</span>
            )}
            {/* Active indicator */}
            {!collapsed && (
              <span className="opacity-0 group-[.active]:opacity-100 md:inline-block hidden w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default SidebarLinks;
