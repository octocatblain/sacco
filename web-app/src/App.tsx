import { FC, useState } from "react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Outlet } from "react-router-dom";
// components
import NavBar from "./components/NavBar";
import SidebarLinks from "./components/SidebarLinks";

const App: FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <NotificationProvider>
      <NavBar
        showMobileMenu={showMobileMenu}
        handleMobileMenuToggle={handleMobileMenuToggle}
      />
      <div className="flex w-full max-w-screen-2xl mx-auto min-h-screen bg-white dark:bg-blue-950">
        {/* Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-gray-200 dark:bg-blue-900 dark:text-white transition-all duration-200 ${
            sidebarCollapsed ? "w-16" : "w-64"
          } min-h-screen sticky top-0 z-20`}
        >
          <div className="flex items-center justify-between px-2 py-3 border-b border-blue-800/20 dark:border-blue-800/40">
            {!sidebarCollapsed && (
              <span className="font-bold text-lg">Menu</span>
            )}
            <button
              className="p-1 rounded hover:bg-blue-800/10 dark:hover:bg-blue-800/30 transition"
              onClick={handleSidebarCollapse}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className={`transition-transform ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M19 12H5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 5l-7 7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0 h-0">
            <SidebarLinks collapsed={sidebarCollapsed} />
          </div>
        </aside>

        {/* mobile navbar */}
        {showMobileMenu && (
          <div className="absolute z-30 block bg-gray-200 dark:bg-blue-950 dark:text-white lg:hidden rounded-md">
            <ul className="list-none p-0 m-5">
              <SidebarLinks onClick={handleMobileMenuToggle} />
            </ul>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-screen bg-white dark:bg-blue-950 dark:text-slate-300 py-4 px-2 md:px-8">
          <Outlet />
        </main>
      </div>
    </NotificationProvider>
  );
};

export default App;
