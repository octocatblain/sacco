import { FC, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LucideIcon from "../../LucideIcon";

interface SidebarLinksProps {
  onClick?: () => void;
  collapsed?: boolean;
  searchQuery?: string;
}

type LeafItem = { label: string; icon: string; to: string };
type GroupItem = { label: string; icon: string; children: LeafItem[] };

const sidebarStructure: Array<LeafItem | GroupItem> = [
  { label: "Dashboard", icon: "LayoutDashboard", to: "/dashboard" },
  {
    label: "Members",
    icon: "Users",
    children: [
      { label: "All Customers", icon: "Users", to: "/dashboard/customers" },
      { label: "Onboarding", icon: "UserPlus", to: "/dashboard/kyc/onboarding" },
      { label: "Applications", icon: "FileText", to: "/dashboard/kyc/applications" },
    ],
  },
  {
    label: "Accounts",
    icon: "CreditCard",
    children: [
      { label: "All Accounts", icon: "List", to: "/dashboard/accounts" },
      { label: "Transactions", icon: "ArrowRightLeft", to: "/dashboard/transactions" },
    ],
  },
  {
    label: "Savings",
    icon: "PiggyBank",
    children: [
      { label: "Products", icon: "Package", to: "/dashboard/savings/products" },
      { label: "Contributions", icon: "Coins", to: "/dashboard/savings/contributions" },
    ],
  },
  {
    label: "Loans",
    icon: "Banknote",
    children: [
      { label: "All Loans", icon: "Files", to: "/dashboard/loans" },
      { label: "Arrears", icon: "AlertTriangle", to: "/dashboard/loans/arrears" },
      { label: "Collections", icon: "Gavel", to: "/dashboard/loans/collections" },
      { label: "Alerts", icon: "BellRing", to: "/dashboard/loans/alerts" },
    ],
  },
  {
    label: "Accounting",
    icon: "Calculator",
    children: [
      { label: "Chart of Accounts", icon: "ListOrdered", to: "/dashboard/accounting/chart-of-accounts" },
      { label: "Journals", icon: "Book", to: "/dashboard/accounting/journals" },
      { label: "Trial Balance", icon: "Scale", to: "/dashboard/accounting/trial-balance" },
    ],
  },
  { label: "Users", icon: "ShieldCheck", to: "/dashboard/users" },
  { label: "Notifications", icon: "Bell", to: "/dashboard/notifications" },
  {
    label: "Settings",
    icon: "Settings",
    children: [
      { label: "My Profile", icon: "User", to: "/dashboard/settings/profile" },
      { label: "User Mgmt", icon: "UsersCog", to: "/dashboard/settings/user" },
      { label: "System", icon: "Sliders", to: "/dashboard/settings/system" },
    ],
  },
  { label: "Help & Support", icon: "HelpCircle", to: "/dashboard/help" },
];

const SidebarLinks: FC<SidebarLinksProps> = ({ onClick, collapsed = false, searchQuery = "" }) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Automatically expand groups if a child is active
  useEffect(() => {
    const newOpenGroups: Record<string, boolean> = {};
    sidebarStructure.forEach((item) => {
      const group = item as GroupItem;
      if (group.children) {
        const hasActiveChild = group.children.some((child) =>
          location.pathname.startsWith(child.to)
        );
        if (hasActiveChild) {
          newOpenGroups[group.label] = true;
        }
      }
    });
    setOpenGroups((prev) => ({ ...prev, ...newOpenGroups }));
  }, [location.pathname]);

    // Automatically expand all groups when filtering
    useEffect(() => {
        if (searchQuery) {
            const allGroupsOpen: Record<string, boolean> = {};
             sidebarStructure.forEach((item) => {
                 const group = item as GroupItem;
                 if(group.children) {
                     allGroupsOpen[group.label] = true;
                 }
             });
             setOpenGroups(allGroupsOpen);
        } else {
             // Reset or logic to restore previous state could go here, but keeping it simple
        }
    }, [searchQuery]);


  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navItemClass = (isActive: boolean) =>
    `group flex items-center gap-x-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md"
         : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
     }
     ${collapsed ? "justify-center px-2" : "px-3"}`;

   // Filtering Logic
  const filteredItems = sidebarStructure.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();

        // Check current item label
        if (item.label.toLowerCase().includes(query)) return true;

        // Check children if group
        const group = item as GroupItem;
        if (group.children) {
            const hasMatchingChild = group.children.some(child => 
                child.label.toLowerCase().includes(query)
            );
            return hasMatchingChild;
        }
        return false;
  }).map(item => {
      // If search query is active and it's a group, we might want to filter the children shown?
      // For now, let's just show the group with all children if the group matches or any child matches.
      // Refined: If we want to ONLY show matching children:
       if (!searchQuery) return item;
       const query = searchQuery.toLowerCase();
       const group = item as GroupItem;
       
       if (group.children) {
            // If group matches, return all children (or should we still filter?)
            // Usually if I search "Settings", I want to see "Profile", "User", "System".
            if (group.label.toLowerCase().includes(query)) return item;

            // If group doesn't match but child does, filter children
            const matchingChildren = group.children.filter(child => 
                child.label.toLowerCase().includes(query)
            );
            if (matchingChildren.length > 0) {
                return { ...group, children: matchingChildren };
            }
       }
       return item;
  });


  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
      {filteredItems.map((item) => {
        // Leaf Item
        if ((item as LeafItem).to) {
          const leaf = item as LeafItem;
          // Safety check for LeafItems that might be returned from map
           if (!leaf.to) return null; 

          return (
            <div key={leaf.label}>
                <NavLink
                  to={leaf.to}
                  onClick={onClick}
                  className={({ isActive }) => navItemClass(isActive)}
                  end={leaf.to === "/dashboard"} // Only exact match for dashboard root
                  title={collapsed ? leaf.label : ""}
                >
                  <LucideIcon name={leaf.icon} size={20} className={collapsed ? "" : "min-w-[20px]"} />
                  {!collapsed && <span>{leaf.label}</span>}
                </NavLink>
            </div>
          );
        }

        // Group Item
        const group = item as GroupItem;
        // Check if group is valid
        if (!group.children) return null;

        const isOpen = !!openGroups[group.label];
        const hasActiveChild = group.children.some((child) =>
             location.pathname.startsWith(child.to)
        );

        return (
          <div key={group.label} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.label)}
              className={`w-full flex items-center justify-between py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${
                  hasActiveChild && !isOpen
                     ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" 
                     : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }
                ${collapsed ? "justify-center px-2" : "px-3"}`}
               title={collapsed ? group.label : ""}
            >
              <div className="flex items-center gap-x-3">
                 <LucideIcon name={group.icon} size={20} className={collapsed ? "" : "min-w-[20px]"} />
                {!collapsed && <span>{group.label}</span>}
              </div>
              {!collapsed && (
                <LucideIcon
                  name="ChevronRight"
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                />
              )}
            </button>

            {/* Children */}
            {isOpen && !collapsed && (
              <div className="pl-9 space-y-1 relative">
                  {/* Vertical Line for hierarchy */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                  
                {group.children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.to}
                    onClick={onClick}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md text-sm transition-colors duration-200 relative
                      ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarLinks;
