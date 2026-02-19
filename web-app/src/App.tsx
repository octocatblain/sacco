import { FC, useState } from "react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Outlet } from "react-router-dom";
import { MessageSquare, ChevronLeft, ChevronRight, Search }  from "lucide-react";

// components
import NavBar from "./components/layout/header/NavBar";
import SidebarLinks from "./components/layout/sidebar/SidebarLinks";

const App: FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
        
         {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-20" : "w-64"
          } h-full z-20`}
        >
          {/* Sidebar Header / Collapse Button Area */}
          <div className="flex items-center justify-between px-4 py-3 h-16 border-b border-gray-100 dark:border-slate-800">
             {!sidebarCollapsed && (
               <div className="relative w-full mr-4">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Menu"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
               </div>
             )}
            <button
              onClick={handleSidebarCollapse}
              className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors ${sidebarCollapsed ? 'mx-auto' : ''}`}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
               {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          
          {/* Sidebar Content */}
          <SidebarLinks collapsed={sidebarCollapsed} searchQuery={searchQuery} />
          
          {/* Sidebar Footer (Optional) */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800">
             <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-x-3"}`}>
                 <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MessageSquare size={16} />
                 </div>
                 {!sidebarCollapsed && (
                     <div>
                         <p className="text-xs font-semibold text-slate-900 dark:text-white">Need Help?</p>
                         <p className="text-[10px] text-slate-500 dark:text-slate-400">Contact Support</p>
                     </div>
                 )}
             </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
                onClick={handleMobileMenuToggle}
            />
            <div className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out h-full flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Menu</span>
                </div>
                <SidebarLinks onClick={handleMobileMenuToggle} />
            </div>
          </div>
        )}


        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
             <NavBar
                showMobileMenu={showMobileMenu}
                handleMobileMenuToggle={handleMobileMenuToggle}
             />
             
             <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-7xl mx-auto h-full">
                     <Outlet />
                </div>
             </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;
