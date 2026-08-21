import { beforeEach, describe, expect, it } from "vitest";

import { useBoardStore } from "./boardStore";

import type { Task } from "../types/task";

const taskOne: Task = {
  id: 1,
  title: "Task 1",
  description: "",
  status: "backlog",
  priority: "high",
  assigneeId: 1,
  dueDate: "2026-08-25",
  sprintId: 3,
  order: 1,
  createdAt: "2026-08-20T10:00:00Z",
  completedAt: null,
  updatedAt: "2026-08-20T10:00:00Z",
};

const taskTwo: Task = {
  ...taskOne,
  id: 2,
  title: "Task 2",
  order: 2,
};

describe("boardStore", () => {
  beforeEach(() => {
    localStorage.clear();

    useBoardStore.setState({
      tasks: [],
      selectedTaskId: null,
    });
  });

  it("adds a task", () => {
    useBoardStore.getState().addTask(taskOne);

    const tasks = useBoardStore.getState().tasks;

    expect(tasks).toHaveLength(1);

    expect(tasks[0].title).toBe("Task 1");
  });

  it("deletes a task", () => {
    useBoardStore.setState({
      tasks: [taskOne, taskTwo],
    });

    useBoardStore.getState().deleteTask(1);

    const tasks = useBoardStore.getState().tasks;

    expect(tasks).toHaveLength(1);

    expect(tasks[0].id).toBe(2);
  });

  it("moves a task to another column", () => {
    useBoardStore.setState({
      tasks: [
        taskOne,
        {
          ...taskTwo,
          status: "in-progress",
          order: 1,
        },
      ],
    });

    useBoardStore.getState().moveTask(1, 2, "in-progress");

    const movedTask = useBoardStore
      .getState()
      .tasks.find((task) => task.id === 1);

    expect(movedTask?.status).toBe("in-progress");
  });
});
