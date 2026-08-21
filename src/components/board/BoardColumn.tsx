import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Task, TaskStatus } from "../../types/task";
import type { User } from "../../types/user";

import TaskCard from "./TaskCard";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  onTaskClick: (taskId: number) => void;
}

function BoardColumn({
  title,
  status,
  tasks,
  users,
  onTaskClick,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[290px] flex-1 rounded-xl border p-4 transition-colors ${
        isOver
          ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40"
          : "border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[120px] space-y-3">
          {tasks.map((task) => {
            const assignee = users.find((user) => user.id === task.assigneeId);

            return (
              <TaskCard
                key={task.id}
                task={task}
                assignee={assignee}
                onClick={() => onTaskClick(task.id)}
              />
            );
          })}

          {tasks.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default BoardColumn;
