import type { ToastItem } from "../../stores/toastStore";

interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-800",

    error: "border-red-200 bg-red-50 text-red-800",

    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div
      role="status"
      className={`flex min-w-[280px] max-w-sm items-start justify-between gap-4 rounded-xl border p-4 shadow-lg ${styles[toast.type]}`}
    >
      <p className="text-sm font-medium">{toast.message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-lg leading-none opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
