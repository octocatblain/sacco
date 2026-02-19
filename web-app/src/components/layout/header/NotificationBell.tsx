import { FC, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import LucideIcon from "../../LucideIcon";

const NotificationBell: FC = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open notifications"
        className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-white/20"
      >
        <LucideIcon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-50 origin-top-right transform transition-all duration-200">
          <NotificationPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

// Lazy local import to avoid circular issues
import NotificationPanel from "./NotificationPanel";
