import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const priorityStyles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-500">Due: {task.dueDate}</p>

      <p className="mt-1 text-xs text-gray-400">Assignee #{task.assigneeId}</p>
    </div>
  );
}

export default TaskCard;
