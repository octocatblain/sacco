import { FC, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import LucideIcon from "@/components/LucideIcon";
import type { NotificationItem, NotificationType } from "@/types";

const mockData: NotificationItem[] = [
  {
    id: "p1",
    title: "System maintenance",
    message: "Tonight 00:00–02:00 EAT.",
    type: "info",
    createdAt: Date.now() - 86400000,
    read: false,
  },
  {
    id: "p2",
    title: "Loan approved",
    message: "Your loan #23981 was approved.",
    type: "success",
    createdAt: Date.now() - 3600000,
    read: false,
  },
  {
    id: "p3",
    title: "Low balance",
    message: "Account 1023 below threshold.",
    type: "warning",
    createdAt: Date.now() - 7200000,
    read: true,
  },
];

const chipClass = (t: NotificationType) => {
  const map: Record<NotificationType, string> = {
    info: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
    success:
      "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    warning:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
  };
  return map[t];
};

const NotificationsPage: FC = () => {
  const [items, setItems] = useState<NotificationItem[]>(mockData);
  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const clear = () => setItems([]);
  const addInfo = () =>
    setItems((prev) => [
      {
        id: `p${Date.now()}`,
        title: "Note",
        message: "FYI update",
        type: "info",
        createdAt: Date.now(),
        read: false,
      },
      ...prev,
    ]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LucideIcon name="Bell" size={20} />
          <h1 className="text-xl font-semibold">Notifications</h1>
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
          <Button variant="secondary" size="sm" onClick={addInfo}>
            Add demo
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-blue-900">
        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-slate-500">
            No notifications
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-blue-800">
            {items.map((n) => (
              <li key={n.id} className="px-4 py-3">
                <button
                  className="w-full text-left"
                  onClick={() => markRead(n.id)}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{n.title}</span>
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded ${chipClass(
                            n.type
                          )}`}
                        >
                          {n.type}
                        </span>
                      </div>
                      {n.message && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {n.message}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
