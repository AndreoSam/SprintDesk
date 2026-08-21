import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

function Modal({ open, title, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousElement = document.activeElement as HTMLElement | null;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    modalRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);

      previousElement?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="w-full max-w-lg rounded-2xl bg-white text-gray-900 shadow-xl outline-none dark:bg-gray-900 dark:text-gray-100"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
            <h2 id="modal-title" className="text-xl font-bold">
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:hover:bg-gray-800 dark:focus:ring-white"
            >
              ✕
            </button>
          </div>

          <div className="p-5">{children}</div>
        </div>
      </div>
    </>
  );
}

export default Modal;
