import { useToastStore } from "../../stores/toastStore";

import Toast from "./Toast";

function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
