import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Notification } from "../types/notification";

interface NotificationState {
  notifications: Notification[];
  initialized: boolean;

  setInitialNotifications: (notifications: Notification[]) => void;

  addNotifications: (notifications: Notification[]) => void;

  markAsRead: (notificationId: number) => void;

  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      initialized: false,

      setInitialNotifications: (notifications) => {
        set((state) => {
          if (state.initialized) {
            return state;
          }

          return {
            notifications,
            initialized: true,
          };
        });
      },

      addNotifications: (newNotifications) => {
        set((state) => {
          const existingIds = new Set(
            state.notifications.map((item) => item.id),
          );

          const unique = newNotifications.filter(
            (item) => !existingIds.has(item.id),
          );

          return {
            notifications: [...unique, ...state.notifications],
          };
        });
      },

      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === notificationId
              ? {
                  ...item,
                  read: true,
                }
              : item,
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((item) => ({
            ...item,
            read: true,
          })),
        }));
      },
    }),
    {
      name: "sprintdesk-notifications",
    },
  ),
);
