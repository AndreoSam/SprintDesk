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
import TaskDrawer from "../components/board/TaskDrawer";
import { useState } from "react";
import CreateTaskModal from "../components/board/CreateTaskModal";
import DeleteTaskModal from "../components/board/DeleteTaskModal";
import BoardSkeleton from "../components/board/BoardSkeleton";

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
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const { tasks, users, comments, isLoading, isError } = useBoardTasks();

  const moveTask = useBoardStore((state) => state.moveTask);
  const selectedTaskId = useBoardStore((state) => state.selectedTaskId);
  const selectTask = useBoardStore((state) => state.selectTask);
  const closeTask = useBoardStore((state) => state.closeTask);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const taskToDelete = tasks.find((task) => task.id === deleteTaskId);

  const selectedTaskComments = comments.filter(
    (comment) => comment.taskId === selectedTaskId,
  );

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
    return <BoardSkeleton />;
  }

  if (isError && tasks.length === 0) {
    return <div className="p-6 text-red-600">Failed to load board.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sprint Board</h1>

          <p className="mt-1 text-gray-500">
            Drag tasks to update sprint progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white"
        >
          + Add Task
        </button>
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
                onTaskClick={selectTask}
              />
            );
          })}
        </div>
      </DndContext>
      {selectedTask && (
        <TaskDrawer
          key={selectedTask.id}
          task={selectedTask}
          users={users}
          comments={selectedTaskComments}
          onClose={closeTask}
          onDelete={(taskId) => setDeleteTaskId(taskId)}
        />
      )}
      <CreateTaskModal
        open={createOpen}
        users={users}
        onClose={() => setCreateOpen(false)}
      />
      {taskToDelete && (
        <DeleteTaskModal
          open={deleteTaskId !== null}
          taskTitle={taskToDelete.title}
          onCancel={() => setDeleteTaskId(null)}
          onConfirm={() => {
            deleteTask(taskToDelete.id);

            setDeleteTaskId(null);

            closeTask();
          }}
        />
      )}
    </div>
  );
}

export default Board;
