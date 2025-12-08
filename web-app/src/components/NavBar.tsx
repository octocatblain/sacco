import { FC, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import ProfilePlaceholder from "@/assets/profile-placeholder.png";
import Logo from "@/assets/open-sacco.png";
// components
import LucideIcon from "./LucideIcon";
// context and custom hook
import { ThemeContext } from "@/contexts/ThemeContext";
import { useUserProfileInfo } from "@/hooks/useUserProfile";
// constants
import { apiBaseUrl } from "@/constants";

interface NavBarProps {
  showMobileMenu: boolean;
  handleMobileMenuToggle: () => void;
}

const NavBar: FC<NavBarProps> = ({
  showMobileMenu,
  handleMobileMenuToggle,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  // dark mode context consumer
  const { toggleDarkTheme, darkTheme } = useContext(ThemeContext);

  // custom hook for user profile
  const { profile } = useUserProfileInfo();

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // close dropdown when user clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  // handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${apiBaseUrl}/api/logout/`);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      // TODO: Confirm dialog before logout and redirect to login page - modal with different sizes
      navigate("/login");
    } catch {
      console.log("error");
    }
  };
  return (
    <div className="max-w-full relative flex items-center justify-between text-white bg-primary h-16 px-4 dark:bg-blue-800 dark:text-slate-300">
      {/* Left: Brand */}
      <div className="flex items-center gap-x-3">
        <img src={Logo} alt="SLAMS logo" className="w-15 h-10" />
        <span className="text-xl font-semibold tracking-wide text-black">
          SLMS
        </span>
        <button
          className="lg:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md hover:bg-white/20"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <LucideIcon name="X" size={24} />
          ) : (
            <LucideIcon name="AlignJustify" size={24} />
          )}
        </button>
      </div>

      {/* Right: Theme toggle and profile */}
      <div className="flex items-center gap-x-4">
        <button
          onClick={toggleDarkTheme}
          className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/20"
          aria-label="Toggle theme"
        >
          {darkTheme ? (
            <LucideIcon name="Moon" size={20} />
          ) : (
            <LucideIcon name="Sun" size={20} />
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleShowDropdown}
            className="flex items-center gap-x-2 rounded-full bg-white/10 hover:bg-white/20 px-2 py-1"
            aria-haspopup="menu"
            aria-expanded={showDropdown}
          >
            <img
              className="rounded-full border border-white w-9 h-9 object-cover"
              src={
                profile?.profile?.profile_image
                  ? `${apiBaseUrl}${profile?.profile?.profile_image}`
                  : ProfilePlaceholder
              }
              alt={profile?.username || "profile"}
            />
            <span className="hidden md:inline-block text-sm font-medium">
              {profile?.username || "User"}
            </span>
            <LucideIcon name="ChevronDown" size={16} />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-64 rounded-md bg-white text-black shadow-lg ring-1 ring-black/5 dark:bg-blue-900 dark:text-white ${
              showDropdown ? "block" : "hidden"
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-x-3 p-3">
              <img
                className="rounded-full w-10 h-10 object-cover"
                src={
                  profile?.profile?.profile_image
                    ? `${apiBaseUrl}${profile?.profile?.profile_image}`
                    : ProfilePlaceholder
                }
                alt={profile?.username || "profile"}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {profile?.username}
                  {profile?.profile?.role_display && (
                    <span className="ml-2 inline-block align-middle rounded-md bg-primary text-black text-[10px] px-1 py-0.5">
                      {profile?.profile?.role_display}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-blue-700" />

            {/* Actions */}
            <div className="p-2">
              <Link
                to="/profile"
                onClick={handleShowDropdown}
                className="flex items-center gap-x-2 rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-blue-800"
              >
                <LucideIcon name="User" size={16} />
                <span className="text-sm">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 w-full flex items-center gap-x-2 rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-blue-800 text-left"
              >
                <LucideIcon name="LogOut" size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
