import { useEffect, useRef, useState } from "react";

import { useToast } from "../../hooks/useToast";

import { useNotifications } from "../../hooks/useNotifications";

import NotificationPanel from "./NotificationPanel";

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { notifications } = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const { showToast } = useToast();

  const previousIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (previousIds.current.size === 0) {
      previousIds.current = new Set(notifications.map((item) => item.id));

      return;
    }

    const newItems = notifications.filter(
      (item) => !previousIds.current.has(item.id),
    );

    if (newItems.length > 0 && !open) {
      showToast(
        `${newItems.length} new notification${newItems.length > 1 ? "s" : ""}`,
        "info",
      );
    }

    previousIds.current = new Set(notifications.map((item) => item.id));
  }, [notifications, open, showToast]);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-haspopup="true"
        aria-expanded={open}
        className={`relative rounded-full p-2 transition focus:outline-none focus:ring-black focus:ring-offset-2 dark:focus:ring-white dark:focus:ring-offset-gray-900 ${
          open
            ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        }`}
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17H9m10-2.5V11a7 7 0 1 0-14 0v3.5L3 17h18l-2-2.5ZM14 20a2.5 2.5 0 0 1-4 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default NotificationBell;
