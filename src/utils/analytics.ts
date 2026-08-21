import type { Task } from "../types/task";
import type { Sprint } from "../types/sprint";

export const getStatusData = (tasks: Task[]) => {
  return [
    {
      name: "Backlog",
      value: tasks.filter((task) => task.status === "backlog").length,
    },
    {
      name: "In Progress",
      value: tasks.filter((task) => task.status === "in-progress").length,
    },
    {
      name: "Review",
      value: tasks.filter((task) => task.status === "review").length,
    },
    {
      name: "Done",
      value: tasks.filter((task) => task.status === "done").length,
    },
  ];
};

export const getPriorityData = (tasks: Task[]) => {
  return [
    {
      name: "High",
      value: tasks.filter((task) => task.priority === "high").length,
    },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "medium").length,
    },
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "low").length,
    },
  ];
};

export const getSprintVelocityData = (tasks: Task[], sprints: Sprint[]) => {
  return sprints.map((sprint) => {
    const completedTasks = tasks.filter(
      (task) => task.sprintId === sprint.id && task.status === "done",
    ).length;

    return {
      sprint: sprint.name,
      completed: completedTasks,
    };
  });
};

export const getCompletionTrendData = (tasks: Task[]) => {
  const completedTasks = tasks
    .filter((task) => task.completedAt)
    .sort(
      (a, b) =>
        new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime(),
    );

  const grouped = new Map<string, number>();

  completedTasks.forEach((task) => {
    const date = new Date(task.completedAt!).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    grouped.set(date, (grouped.get(date) ?? 0) + 1);
  });

  let total = 0;

  return Array.from(grouped.entries()).map(([date, completed]) => {
    total += completed;

    return {
      date,
      completed: total,
    };
  });
};
