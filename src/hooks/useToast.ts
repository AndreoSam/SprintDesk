import { useCallback } from "react";

import { useToastStore, type ToastType } from "../stores/toastStore";

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      addToast(message, type);
    },
    [addToast],
  );

  return {
    showToast,
  };
};
