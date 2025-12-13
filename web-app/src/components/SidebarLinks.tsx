import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
// components
import LucideIcon from "./LucideIcon";

interface SidebarLinksProps {
  onClick?: () => void;
  collapsed?: boolean; // when true, show icon-only (tooltip-like) sidebar
}

type LeafItem = { label: string; icon: string; to: string };
type GroupItem = { label: string; icon: string; children: LeafItem[] };

// Professional logical arrangement for savings & loan management system
const sidebarStructure: Array<LeafItem | GroupItem> = [
  { label: "Dashboard", icon: "BarChart4", to: "/" },
  {
    label: "Members",
    icon: "Users",
    children: [
      { label: "Customers", icon: "Users", to: "/customers" },
      { label: "KYC Onboarding", icon: "UserPlus", to: "/kyc/onboarding" },
      { label: "KYC Applications", icon: "List", to: "/kyc/applications" },
    ],
  },
  {
    label: "Accounts",
    icon: "CreditCard",
    children: [
      { label: "Accounts", icon: "CreditCard", to: "/accounts" },
      { label: "Transactions", icon: "Wallet", to: "/transactions" },
    ],
  },
  {
    label: "Savings",
    icon: "PiggyBank",
    children: [
      { label: "Products", icon: "BookOpen", to: "/savings/products" },
      {
        label: "My Contributions",
        icon: "Coins",
        to: "/savings/contributions",
      },
    ],
  },
  {
    label: "Loans",
    icon: "Wallet",
    children: [
      { label: "All Loans", icon: "Wallet", to: "/loans" },
      { label: "Arrears", icon: "Alert", to: "/loans/arrears" },
      { label: "Collections", icon: "FileWarning", to: "/loans/collections" },
      { label: "Alerts", icon: "Bell", to: "/loans/alerts" },
    ],
  },
  {
    label: "Accounting",
    icon: "BookOpen",
    children: [
      {
        label: "Chart of Accounts",
        icon: "ListOrdered",
        to: "/accounting/chart-of-accounts",
      },
      { label: "Journals", icon: "Notebook", to: "/accounting/journals" },
      {
        label: "Trial Balance",
        icon: "Scale",
        to: "/accounting/trial-balance",
      },
    ],
  },
  { label: "Users", icon: "Users", to: "/users" },
  { label: "Notifications", icon: "Bell", to: "/notifications" },
  {
    label: "Settings",
    icon: "Settings",
    children: [
      {
        label: "Profile Settings",
        icon: "UserCog",
        to: "/settings/profile",
      },

      { label: "User Settings", icon: "Users", to: "/settings/user" },
      {
        label: "System Settings",
        icon: "Sliders",
        to: "/settings/system",
      },
    ],
  },
  { label: "Help", icon: "CircleHelp", to: "/help" },
];
const SidebarLinks: FC<SidebarLinksProps> = ({
  onClick,
  collapsed = false,
}) => {
  // Track open groups in local component state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <ul
      className={`space-y-2 ${collapsed ? "px-2" : ""}`}
      style={{
        maxHeight: "calc(100vh - 60px)",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {sidebarStructure.map((item) => {
        // Render leaf link
        if ((item as LeafItem).to) {
          const leaf = item as LeafItem;
          return (
            <li key={leaf.label}>
              <NavLink
                to={leaf.to}
                onClick={onClick}
                className={({ isActive }) =>
                  `group flex items-center justify-start gap-x-3 py-2.5 ${
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
                  <LucideIcon name={leaf.icon} />
                </span>
                {!collapsed && (
                  <span className="flex-1 truncate">{leaf.label}</span>
                )}
                {!collapsed && (
                  <span className="opacity-0 group-[.active]:opacity-100 md:inline-block hidden w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </NavLink>
            </li>
          );
        }

        // Render group with children
        const group = item as GroupItem;
        const isOpen = !!openGroups[group.label];
        return (
          <li key={group.label}>
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className={`w-full group flex items-center justify-start gap-x-3 py-2.5 ${
                collapsed ? "px-2" : "px-3"
              } rounded-md text-sm md:text-base transition-all duration-200
               bg-white text-slate-800 hover:bg-slate-100
               dark:bg-blue-900 dark:text-slate-200 dark:hover:bg-blue-800
               border border-transparent dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-primary/60`}
            >
              <span
                className={`inline-flex items-center justify-center ${
                  collapsed ? "w-8 h-8" : "w-6 h-6"
                }`}
              >
                <LucideIcon name={group.icon} />
              </span>
              {!collapsed && (
                <span className="flex-1 truncate">{group.label}</span>
              )}
              {!collapsed && (
                <span
                  className={`ml-auto transition-transform ${
                    isOpen ? "rotate-90" : "rotate-0"
                  }`}
                >
                  <LucideIcon name="ChevronRight" />
                </span>
              )}
            </button>

            {/* Children */}
            {isOpen && !collapsed && (
              <ul className="mt-1 ml-6 space-y-1">
                {group.children.map((leaf) => (
                  <li key={leaf.label}>
                    <NavLink
                      to={leaf.to}
                      onClick={onClick}
                      className={({ isActive }) =>
                        `group flex items-center justify-start gap-x-3 py-2 px-3 rounded-md text-sm transition-all duration-200
                         bg-white text-slate-700 hover:bg-slate-100
                         dark:bg-blue-900 dark:text-slate-300 dark:hover:bg-blue-800
                         border border-transparent dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-primary/60
                         ${isActive ? "shadow-sm ring-1 ring-primary/40" : ""}`
                      }
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5">
                        <LucideIcon name={leaf.icon} />
                      </span>
                      <span className="flex-1 truncate">{leaf.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
      <style>{`
        ul::-webkit-scrollbar { display: none; }
      `}</style>
    </ul>
  );
};

export default SidebarLinks;
