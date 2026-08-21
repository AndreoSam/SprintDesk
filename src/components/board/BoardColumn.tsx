import type { Task, TaskStatus } from "../../types/task";

import TaskCard from "./TaskCard";

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

function BoardColumn({ title, tasks }: BoardColumnProps) {
  return (
    <div className="min-w-[280px] flex-1 rounded-xl bg-gray-100 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">{title}</h2>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-600">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardColumn;
