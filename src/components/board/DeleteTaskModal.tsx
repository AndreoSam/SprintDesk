import Modal from "../ui/Modal";

interface DeleteTaskModalProps {
  open: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteTaskModal({
  open,
  taskTitle,
  onCancel,
  onConfirm,
}: DeleteTaskModalProps) {
  return (
    <Modal open={open} title="Delete Task" onClose={onCancel}>
      <p className="text-sm leading-6 text-gray-600">
        Are you sure you want to delete <strong>{taskTitle}</strong>? This
        action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default DeleteTaskModal;
