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
        className="relative rounded-lg p-2 text-xl hover:bg-gray-100"
      >
        🔔
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
