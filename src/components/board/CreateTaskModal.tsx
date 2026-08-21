import { useState, type FormEvent } from "react";

import Modal from "../ui/Modal";

import { useBoardStore } from "../../stores/boardStore";

import type { User } from "../../types/user";
import type { Task, TaskPriority } from "../../types/task";
import Button from "../ui/Button";
interface CreateTaskModalProps {
  open: boolean;
  users: User[];
  onClose: () => void;
}

function CreateTaskModal({ open, users, onClose }: CreateTaskModalProps) {
  const tasks = useBoardStore((state) => state.tasks);

  const addTask = useBoardStore((state) => state.addTask);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const [assigneeId, setAssigneeId] = useState<number>(users[0]?.id ?? 1);

  const [dueDate, setDueDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setPriority("medium");

    setAssigneeId(users[0]?.id ?? 1);

    setDueDate("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !dueDate) {
      return;
    }

    const maxId =
      tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) : 0;

    const backlogTasks = tasks.filter((task) => task.status === "backlog");

    const newTask: Task = {
      id: maxId + 1,

      title: title.trim(),

      description: "",

      status: "backlog",

      priority,

      assigneeId,

      dueDate,

      sprintId: 3,

      order: backlogTasks.length + 1,

      createdAt: new Date().toISOString(),

      completedAt: null,

      updatedAt: new Date().toISOString(),
    };

    addTask(newTask);

    resetForm();
    onClose();
  };

  return (
    <Modal open={open} title="Create Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="new-task-title"
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>

          <input
            id="new-task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter task title"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="new-task-priority"
            className="mb-2 block text-sm font-medium"
          >
            Priority
          </label>

          <select
            id="new-task-priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="new-task-assignee"
            className="mb-2 block text-sm font-medium"
          >
            Assignee
          </label>

          <select
            id="new-task-assignee"
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
            htmlFor="new-task-date"
            className="mb-2 block text-sm font-medium"
          >
            Due Date
          </label>

          <input
            id="new-task-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 font-medium text-white"
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTaskModal;
