import { FC } from "react";
import { NavLink } from "react-router-dom";
// components
import LucideIcon from "./LucideIcon";

interface SidebarLinksProps {
  onClick?: () => void;
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
    label: "Settings",
    icon: "Settings",
    to: "/settings",
  },
  {
    label: "Help",
    icon: "CircleHelp",
    to: "/help",
  },
  {
    label: "Users",
    icon: "Users",
    to: "/users",
  },
];
const SidebarLinks: FC<SidebarLinksProps> = ({ onClick }) => {
  return (
    <>
      {sidebarItems.map((item) => (
        <li className="" key={item.label}>
          <NavLink
            to={item.to}
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center gap-x-3 py-2 px-3 text-base rounded-md transition-colors duration-200
               bg-white text-slate-800 hover:bg-slate-100
               dark:bg-blue-900 dark:text-slate-200 dark:hover:bg-blue-800
               border border-transparent dark:border-blue-800
               ${
                 isActive
                   ? "border-slate-300 dark:border-blue-600 shadow-sm"
                   : ""
               }`
            }
          >
            <LucideIcon name={item.icon} /> {item.label}
          </NavLink>
          <div className=" w-full border border-slate-100 dark:border-blue-600 my-5 max-md:my-3"></div>
        </li>
      ))}
    </>
  );
};

export default SidebarLinks;
