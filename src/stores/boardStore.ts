import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types/task";

interface BoardState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

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
    }),
    {
      name: "sprintdesk-board",
    },
  ),
);
