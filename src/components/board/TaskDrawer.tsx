import { useEffect, useState, type FormEvent } from "react";

import type { Task } from "../../types/task";
import type { User } from "../../types/user";
import type { Comment } from "../../types/comment";

import { useBoardStore } from "../../stores/boardStore";
import { useCommentStore } from "../../stores/commentStore";

interface TaskDrawerProps {
  task: Task;
  users: User[];
  comments: Comment[];
  onClose: () => void;
}

function TaskDrawer({ task, users, comments, onClose }: TaskDrawerProps) {
  const updateTask = useBoardStore((state) => state.updateTask);

  const addComment = useCommentStore((state) => state.addComment);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [comment, setComment] = useState("");

  //   useEffect(() => {
  //     setTitle(task.title);
  //     setDescription(task.description);
  //     setStatus(task.status);
  //     setPriority(task.priority);
  //     setAssigneeId(task.assigneeId);
  //     setDueDate(task.dueDate);
  //   }, [task]);

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

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      dueDate,
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) {
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      taskId: task.id,

      // Temporary current user for mock comments.
      // We'll connect this to authenticated user data later.
      authorId: 1,

      message: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    addComment(newComment);

    setComment("");
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white p-6">
          <div>
            <p className="text-sm text-gray-500">Task #{task.id}</p>

            <h2 id="task-drawer-title" className="mt-1 text-xl font-bold">
              Task Details
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

        <form onSubmit={handleSave} className="space-y-6 p-6">
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium"
            >
              Title
            </label>

            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as Task["status"])
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="backlog">Backlog</option>

                <option value="in-progress">In Progress</option>

                <option value="review">Review</option>

                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as Task["priority"])
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="low">Low</option>

                <option value="medium">Medium</option>

                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="task-assignee"
              className="mb-2 block text-sm font-medium"
            >
              Assignee
            </label>

            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(event) => setAssigneeId(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-sm font-medium"
            >
              Due Date
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>

        <section className="border-t p-6">
          <h3 className="font-semibold">Comments</h3>

          <div className="mt-4 flex gap-2">
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="Write a comment..."
              aria-label="Comment"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={handleAddComment}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Add
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {comments.length === 0 && (
              <p className="text-sm text-gray-400">No comments yet.</p>
            )}

            {comments.map((item) => {
              const author = users.find((user) => user.id === item.authorId);

              return (
                <div key={item.id} className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    {author && (
                      <img
                        src={author.avatar}
                        alt={`${author.name} avatar`}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    )}

                    <span className="text-sm font-semibold">
                      {author?.name ?? "Unknown user"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </aside>
    </>
  );
}

export default TaskDrawer;
