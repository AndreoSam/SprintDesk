import { useEffect } from "react";

import type { Task } from "../../types/task";
import type { User } from "../../types/user";
import type { Comment } from "../../types/comment";

interface TaskDrawerProps {
  task: Task;
  users: User[];
  comments: Comment[];
  onClose: () => void;
}

function TaskDrawer({ task, users, comments, onClose }: TaskDrawerProps) {
  const assignee = users.find((user) => user.id === task.assigneeId);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl"
      >
        <div className="border-b p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Task #{task.id}</p>

              <h2
                id="task-drawer-title"
                className="mt-1 text-xl font-bold text-gray-900"
              >
                {task.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close task details"
              className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-8 p-6">
          <section>
            <h3 className="text-sm font-semibold text-gray-900">Description</h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {task.description}
            </p>
          </section>

          <section className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Status
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                {task.status.replace("-", " ")}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Priority
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                {task.priority}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Due date
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Assignee
              </p>

              {assignee ? (
                <div className="mt-1 flex items-center gap-2">
                  <img
                    src={assignee.avatar}
                    alt={`${assignee.name} avatar`}
                    className="h-7 w-7 rounded-full object-cover"
                  />

                  <span className="text-sm text-gray-700">{assignee.name}</span>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-400">Unassigned</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900">Comments</h3>

            <div className="mt-4 space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-gray-400">No comments yet.</p>
              )}

              {comments.map((comment) => {
                const author = users.find(
                  (user) => user.id === comment.authorId,
                );

                return (
                  <div key={comment.id} className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      {author && (
                        <img
                          src={author.avatar}
                          alt={`${author.name} avatar`}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      )}

                      <span className="text-sm font-semibold text-gray-800">
                        {author?.name ?? "Unknown user"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {comment.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

export default TaskDrawer;
