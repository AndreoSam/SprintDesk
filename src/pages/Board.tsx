import BoardColumn from "../components/board/BoardColumn";
import { useBoardTasks } from "../hooks/useBoardTasks";

import type { TaskStatus } from "../types/task";

const columns: {
  title: string;
  status: TaskStatus;
}[] = [
  {
    title: "Backlog",
    status: "backlog",
  },
  {
    title: "In Progress",
    status: "in-progress",
  },
  {
    title: "Review",
    status: "review",
  },
  {
    title: "Done",
    status: "done",
  },
];

function Board() {
  const { tasks, isLoading, isError } = useBoardTasks();

  if (isLoading && tasks.length === 0) {
    return <div className="p-6">Loading board...</div>;
  }

  if (isError && tasks.length === 0) {
    return <div className="p-6 text-red-600">Failed to load board.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sprint Board</h1>

        <p className="mt-1 text-gray-500">Manage and track sprint tasks.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = tasks
            .filter((task) => task.status === column.status)
            .sort((a, b) => a.order - b.order);

          return (
            <BoardColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;
