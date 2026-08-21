import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import BoardColumn from "../components/board/BoardColumn";
import { useBoardTasks } from "../hooks/useBoardTasks";
import { useBoardStore } from "../stores/boardStore";

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
  const { tasks, users, isLoading, isError } = useBoardTasks();

  const moveTask = useBoardStore((state) => state.moveTask);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = Number(active.id);

    const activeTask = tasks.find((task) => task.id === activeId);

    if (!activeTask) {
      return;
    }

    let newStatus: TaskStatus | undefined;

    let overId = activeId;

    const overData = over.data.current;

    if (overData?.type === "column") {
      newStatus = overData.status as TaskStatus;
    }

    if (overData?.type === "task") {
      const overTask = overData.task;

      newStatus = overTask.status;

      overId = overTask.id;
    }

    if (!newStatus) {
      return;
    }

    moveTask(activeId, overId, newStatus);
  };

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

        <p className="mt-1 text-gray-500">
          Drag tasks to update sprint progress.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
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
                users={users}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;
