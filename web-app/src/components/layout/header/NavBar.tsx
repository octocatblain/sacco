import { FC, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, Search, Sun, Moon, LogOut, Settings, User } from "lucide-react";

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
              className="flex items-center gap-x-2 rounded-full ring-2 ring-transparent focus:ring-blue-500/30 transition-shadow"
              aria-haspopup="menu"
              aria-expanded={showDropdown}
            >
              <img
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                src={
                  profile?.profile?.profile_image
                    ? `${apiBaseUrl}${profile?.profile?.profile_image}`
                    : ProfilePlaceholder
                }
                alt={profile?.username || "profile"}
              />
              <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-none">
                      {profile?.username || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide">
                      {profile?.profile?.role_display || "Member"}
                  </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    
                    {/* User Info Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {profile?.username}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {profile?.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        <Link
                            to="/dashboard/profile"
                            onClick={handleShowDropdown}
                            className="flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                         <Link
                            to="/dashboard/settings"
                            onClick={handleShowDropdown}
                            className="flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <div className="p-2">
                         <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
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
