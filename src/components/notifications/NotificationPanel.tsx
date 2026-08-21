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
    <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {notifications.filter((item) => !item.read).length} unread
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-end border-b border-gray-200 p-3 dark:border-gray-700">
        <button
          type="button"
          onClick={markAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {visibleNotifications.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No notifications.
          </p>
        )}

        {visibleNotifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => markAsRead(notification.id)}
            className={`block w-full border-b border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${
              !notification.read
                ? "bg-blue-50/50 dark:bg-blue-950/30"
                : "bg-white dark:bg-gray-900"
            }`}
          >
            <div className="flex items-start gap-3">
              {!notification.read && (
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
                  aria-label="Unread"
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {notification.title}
                </p>

                <p className="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-300">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 p-3 dark:border-gray-700">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Previous
          </button>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
