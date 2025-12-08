import { FC, useMemo, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import type { NotificationItem } from "@/types";
import { Button } from "@/components/ui/button";
import LucideIcon from "./LucideIcon";

const typeChip = (t: NotificationItem["type"]) => {
  const map: Record<NotificationItem["type"], string> = {
    info: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
    success:
      "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    warning:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
  };
  return map[t];
};

const NotificationRow: FC<{ n: NotificationItem; onClick: () => void }> = ({
  n,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-blue-800"
    >
      <div className="flex items-start gap-2">
        {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{n.title}</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded ${typeChip(
                n.type
              )}`}
            >
              {n.type}
            </span>
          </div>
          {n.message && (
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {n.message}
            </p>
          )}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {new Date(n.createdAt).toLocaleString()}
        </span>
      </div>
    </button>
  );
};

const NotificationPanel: FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { notifications, unreadCount, markRead, markAllRead, clear } =
    useNotifications();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const items = useMemo(
    () =>
      tab === "unread" ? notifications.filter((n) => !n.read) : notifications,
    [tab, notifications]
  );

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <LucideIcon name="Bell" size={16} />
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs rounded bg-blue-600 text-white px-1.5 py-0.5">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clear}>
            Clear
          </Button>
          {onClose && (
            <button
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-blue-800"
              onClick={onClose}
              aria-label="Close"
            >
              <LucideIcon name="X" size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-blue-700" />

      {/* Tabs */}
      <div className="flex gap-2 px-2 py-2 text-sm">
        <button
          className={`px-2 py-1 rounded ${
            tab === "all"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-100 dark:hover:bg-blue-800"
          }`}
          onClick={() => setTab("all")}
        >
          All
        </button>
        <button
          className={`px-2 py-1 rounded ${
            tab === "unread"
              ? "bg-blue-600 text-white"
              : "hover:bg-slate-100 dark:hover:bg-blue-800"
          }`}
          onClick={() => setTab("unread")}
        >
          Unread
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-auto p-1">
        {items.length === 0 ? (
          <div className="px-3 py-4 text-sm text-slate-500">
            No notifications
          </div>
        ) : (
          items.map((n) => (
            <NotificationRow key={n.id} n={n} onClick={() => markRead(n.id)} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
