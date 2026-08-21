import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Task, TaskStatus } from "../types/task";

interface BoardState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  deleteTask: (taskId: number) => void;

  updateTaskStatus: (taskId: number, status: TaskStatus) => void;

  moveTask: (activeId: number, overId: number, newStatus: TaskStatus) => void;

  selectedTaskId: number | null;

  selectTask: (taskId: number) => void;

  closeTask: () => void;

  updateTask: (taskId: number, updates: Partial<Task>) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

      selectedTaskId: null,

      selectTask: (taskId) => {
        set({
          selectedTaskId: taskId,
        });
      },

      closeTask: () => {
        set({
          selectedTaskId: null,
        });
      },

      setTasks: (tasks) => {
        set({ tasks });
      },

      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        }));
      },

      moveTask: (activeId, overId, newStatus) => {
        set((state) => {
          const activeTask = state.tasks.find((task) => task.id === activeId);

          const overTask = state.tasks.find((task) => task.id === overId);

          if (!activeTask) {
            return state;
          }

          const oldStatus = activeTask.status;

          const updatedTasks = state.tasks.map((task) => {
            if (task.id === activeId) {
              return {
                ...task,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              };
            }

            return task;
          });

          const sourceTasks = updatedTasks
            .filter((task) => task.status === oldStatus && task.id !== activeId)
            .sort((a, b) => a.order - b.order);

          const destinationTasks = updatedTasks
            .filter((task) => task.status === newStatus && task.id !== activeId)
            .sort((a, b) => a.order - b.order);

          let insertIndex = destinationTasks.length;

          if (overTask && overTask.status === newStatus) {
            const foundIndex = destinationTasks.findIndex(
              (task) => task.id === overId,
            );

            if (foundIndex !== -1) {
              insertIndex = foundIndex;
            }
          }

          destinationTasks.splice(insertIndex, 0, {
            ...activeTask,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          });

          const sourceIds = new Set(sourceTasks.map((task) => task.id));

          const destinationIds = new Set(
            destinationTasks.map((task) => task.id),
          );

          return {
            tasks: updatedTasks.map((task) => {
              if (sourceIds.has(task.id)) {
                const index = sourceTasks.findIndex(
                  (item) => item.id === task.id,
                );

                return {
                  ...task,
                  order: index + 1,
                };
              }

              if (destinationIds.has(task.id)) {
                const index = destinationTasks.findIndex(
                  (item) => item.id === task.id,
                );

                const reorderedTask = destinationTasks[index];

                return {
                  ...task,
                  ...reorderedTask,
                  order: index + 1,
                };
              }

              return task;
            }),
          };
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        }));
      },
    }),
    {
      name: "sprintdesk-board",
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    },
  ),
);
