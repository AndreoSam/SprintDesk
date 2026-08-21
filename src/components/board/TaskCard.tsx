import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../../types/task";
import type { User } from "../../types/user";
import { memo } from "react";
interface TaskCardProps {
  task: Task;
  assignee?: User;
  onClick: () => void;
}

function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyles = {
    high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",

    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",

    low: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  };

  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5 text-gray-900 dark:text-gray-100">
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium capitalize ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee ? (
            <>
              <img
                src={assignee.avatar}
                alt={`${assignee.name} avatar`}
                className="h-7 w-7 rounded-full object-cover"
              />

              <span className="text-xs text-gray-600 dark:text-gray-300">
                {assignee.name}
              </span>
            </>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Unassigned
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
export default memo(TaskCard);
// export default TaskCard;
