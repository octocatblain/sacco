import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { NotificationItem, NotificationType } from "@/types";

type NotificationContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  add: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return ctx;
};

const mockSeed: NotificationItem[] = [
  {
    id: "n1",
    title: "Welcome to SLMS",
    message: "You're all set!",
    type: "success",
    createdAt: Date.now() - 1000 * 60 * 60,
    read: false,
  },
  {
    id: "n2",
    title: "Password updated",
    message: "Your password was changed successfully.",
    type: "info",
    createdAt: Date.now() - 1000 * 60 * 120,
    read: true,
  },
];

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockSeed);

  // Optional: simulate new notifications every few minutes
  useEffect(() => {
    const types: NotificationType[] = ["info", "success", "warning", "error"];
    const timer = setInterval(() => {
      const t = types[Math.floor(Math.random() * types.length)];
      setNotifications((prev) => [
        {
          id: `n${Date.now()}`,
          title:
            t === "warning"
              ? "Low account balance"
              : t === "error"
              ? "Sync failed"
              : t === "success"
              ? "Export complete"
              : "New message",
          message: t === "error" ? "Please retry in a moment." : undefined,
          type: t,
          createdAt: Date.now(),
          read: false,
        },
        ...prev,
      ]);
    }, 1000 * 60 * 5); // every 5 minutes
    return () => clearInterval(timer);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const add: NotificationContextValue["add"] = (n) => {
    setNotifications((prev) => [
      { id: `n${Date.now()}`, createdAt: Date.now(), read: false, ...n },
      ...prev,
    ]);
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clear = () => setNotifications([]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    add,
    markRead,
    markAllRead,
    clear,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
