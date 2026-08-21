import { useState } from "react";

import type { Notification } from "../../types/notification";

import { useNotificationStore } from "../../stores/notificationStore";

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

const ITEMS_PER_PAGE = 20;

function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
  const [page, setPage] = useState(1);

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / ITEMS_PER_PAGE),
  );

  const start = (page - 1) * ITEMS_PER_PAGE;

  const visibleNotifications = notifications.slice(
    start,
    start + ITEMS_PER_PAGE,
  );

  return (
    <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="font-semibold">Notifications</h2>

          <p className="text-xs text-gray-500">
            {notifications.filter((item) => !item.read).length} unread
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-end border-b p-3">
        <button
          type="button"
          onClick={markAllAsRead}
          className="text-sm font-medium text-blue-600"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {visibleNotifications.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">
            No notifications.
          </p>
        )}

        {visibleNotifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => markAsRead(notification.id)}
            className={`block w-full border-b p-4 text-left hover:bg-gray-50 ${
              !notification.read ? "bg-blue-50/50" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              {!notification.read && (
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"
                  aria-label="Unread"
                />
              )}

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-600">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-gray-500">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
