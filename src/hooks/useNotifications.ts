import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotificationPosts } from "../api/notificationApi";

import { getNotifications } from "../services/mockDataService";

import { useNotificationStore } from "../stores/notificationStore";

import type { Notification } from "../types/notification";

export const useNotifications = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  const setInitialNotifications = useNotificationStore(
    (state) => state.setInitialNotifications,
  );

  const addNotifications = useNotificationStore(
    (state) => state.addNotifications,
  );

  const initialQuery = useQuery({
    queryKey: ["initial-notifications"],
    queryFn: getNotifications,
  });

  const pollingQuery = useQuery({
    queryKey: ["notification-posts"],

    queryFn: fetchNotificationPosts,

    refetchInterval: () => {
      if (document.visibilityState === "hidden") {
        return false;
      }

      return 15000;
    },

    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (initialQuery.data) {
      setInitialNotifications(initialQuery.data);
    }
  }, [initialQuery.data, setInitialNotifications]);

  useEffect(() => {
    if (!pollingQuery.data) {
      return;
    }

    const mappedNotifications: Notification[] = pollingQuery.data.map(
      (post) => ({
        // Offset keeps IDs separate
        // from mock notification IDs.
        id: 1000 + post.id,

        title: "New sprint activity",

        message: post.title,

        type: "system",

        read: false,

        createdAt: new Date().toISOString(),
      }),
    );

    addNotifications(mappedNotifications);
  }, [pollingQuery.data, addNotifications]);
  const refetchNotifications = pollingQuery.refetch;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetchNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchNotifications]);

  return {
    notifications,

    isLoading: initialQuery.isLoading,

    isError: initialQuery.isError || pollingQuery.isError,
  };
};
