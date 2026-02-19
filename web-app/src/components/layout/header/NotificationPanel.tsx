import { FC } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import type { NotificationItem } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { 
  CheckCheck, 
  Trash2, 
  X, 
  BellOff, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle 
} from "lucide-react";

// Helper to get icon and color based on type
const getNotificationStyle = (type: NotificationItem["type"]) => {
  switch (type) {
    case "success":
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />,
        bg: "bg-green-100 dark:bg-green-900/30",
        border: "border-green-200 dark:border-green-900"
      };
    case "warning":
      return {
        icon: <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        border: "border-yellow-200 dark:border-yellow-900"
      };
    case "error":
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
        bg: "bg-red-100 dark:bg-red-900/30",
        border: "border-red-200 dark:border-red-900"
      };
    case "info":
    default:
      return {
        icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-200 dark:border-blue-900"
      };
  }
};

const NotificationRow: FC<{ n: NotificationItem; onClick: () => void }> = ({
  n,
  onClick,
}) => {
  const style = getNotificationStyle(n.type);
  const timeAgo = formatDistanceToNow(new Date(n.createdAt), { addSuffix: true });

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 ${
        !n.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
      }`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${style.bg} ${style.border} border`}>
        {style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
           <p className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${!n.read ? "font-bold" : ""}`}>
             {n.title}
           </p>
           <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
             {timeAgo}
           </span>
        </div>
        
        {n.message && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
            {n.message}
          </p>
        )}
      </div>

       {/* Unread Indicator */}
      {!n.read && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
             <span className="block w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900"></span>
        </div>
      )}
    </div>
  );
};

const NotificationPanel: FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { notifications, unreadCount, markRead, markAllRead, clear } =
    useNotifications();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden w-[400px] max-w-[90vw]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
             <>
                <button
                    onClick={markAllRead}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Mark all as read"
                >
                    <CheckCheck className="w-4 h-4" />
                </button>
                <button
                    onClick={clear}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Clear all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
             </>
          )}
          {onClose && (
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[500px] p-2 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-500 dark:text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <BellOff className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <div>
                 <p className="text-sm font-medium text-slate-900 dark:text-white">No notifications yet</p>
                 <p className="text-xs mt-1">When you get notifications, they'll show up here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
               <NotificationRow key={n.id} n={n} onClick={() => markRead(n.id)} />
            ))}
          </div>
        )}
      </div>
      
       {/* Footer (Optional) */}
       {notifications.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Showing last {notifications.length} notifications
              </p>
          </div>
       )}
    </div>
  );
};

export default NotificationPanel;
