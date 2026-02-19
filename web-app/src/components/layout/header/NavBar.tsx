import { FC, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, Search, Sun, Moon, LogOut, Settings, User, ChevronDown } from "lucide-react";

import ProfilePlaceholder from "@/assets/profile-placeholder.png";
import Logo from "@/assets/open-sacco.png";

import { ThemeContext } from "@/contexts/ThemeContext";
import { useUserProfileInfo } from "@/hooks/useUserProfile";
import { apiBaseUrl } from "@/constants";

import NotificationBell from "./NotificationBell";

interface NavBarProps {
  showMobileMenu: boolean;
  handleMobileMenuToggle: () => void;
}

const NavBar: FC<NavBarProps> = ({
  showMobileMenu,
  handleMobileMenuToggle,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { toggleDarkTheme, darkTheme } = useContext(ThemeContext);
  const { profile } = useUserProfileInfo();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = async () => {
    try {
      await axios.get(`${apiBaseUrl}/api/logout/`);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user"); // Clear user data
      navigate("/login");
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center gap-x-4">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
             <Menu className="w-6 h-6" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-x-3 group">
            <div className="relative">
                 <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <img src={Logo} alt="SLMS logo" className="relative w-8 h-8 object-contain" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hidden sm:block">
              SLMS
            </span>
          </Link>
        </div>

        {/* Center: Search (Optional - visual only for now) */}
         <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search resources..." 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
         </div>


        {/* Right: Actions */}
        <div className="flex items-center gap-x-2 md:gap-x-4">
          {/* Notifications */}
          <div className="relative">
              <NotificationBell />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkTheme ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleShowDropdown}
              className="group flex items-center gap-x-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              aria-haspopup="menu"
              aria-expanded={showDropdown}
            >
              <div className="relative">
                <img
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
                  src={
                    profile?.profile?.profile_image
                      ? `${apiBaseUrl}${profile?.profile?.profile_image}`
                      : ProfilePlaceholder
                  }
                  alt={profile?.username || "profile"}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-800"></span>
              </div>
              
              <div className="hidden md:flex flex-col items-start px-1 text-left">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile?.username || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                      {profile?.profile?.role_display || "Member"}
                  </p>
              </div>
              
              <ChevronDown 
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-transform duration-200 hidden md:block ${
                  showDropdown ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right z-50">
                    
                    {/* User Info Header */}
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Signed in as
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                            {profile?.email || "user@example.com"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                {profile?.profile?.role_display || "Member"}
                             </span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        <Link
                            to="/dashboard/profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                        >
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 text-slate-500 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400 transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <span>My Profile</span>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Account details & preferences</p>
                            </div>
                        </Link>
                         <Link
                            to="/dashboard/settings/system"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                        >
                             <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 text-slate-500 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400 transition-colors">
                                <Settings className="w-4 h-4" />
                             </div>
                             <div className="flex-1">
                                <span>System Settings</span>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Configure application parameters</p>
                            </div>
                        </Link>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 rounded-b-2xl">
                         <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                        >
                            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/10 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 text-red-500 group-hover:text-red-600 dark:text-red-400 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
