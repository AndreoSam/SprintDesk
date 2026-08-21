import { useMemo } from "react";

import DataTable, { type DataTableColumn } from "../components/ui/DataTable";

import { useBoardTasks } from "../hooks/useBoardTasks";

import type { Task } from "../types/task";

function Dashboard() {
  const { tasks, users, isLoading } = useBoardTasks();

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 8),
    [tasks],
  );

  const columns: DataTableColumn<Task>[] = [
    {
      key: "title",
      header: "Task",
      render: (task) => task.title,
    },
    {
      key: "status",
      header: "Status",
      render: (task) => task.status.replace("-", " "),
    },
    {
      key: "priority",
      header: "Priority",
      render: (task) => task.priority,
    },
    {
      key: "assignee",
      header: "Assignee",
      render: (task) => {
        const user = users.find((item) => item.id === task.assigneeId);

        return user?.name ?? "Unassigned";
      },
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (task) => new Date(task.dueDate).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const done = tasks.filter((task) => task.status === "done").length;

  const active = tasks.filter(
    (task) => task.status === "in-progress" || task.status === "review",
  ).length;

  return (
    <div className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>

        <p className="mt-1 text-gray-500">
          Sprint overview and recent activity.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Tasks</p>

          <p className="mt-2 text-3xl font-bold">{tasks.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Active</p>

          <p className="mt-2 text-3xl font-bold">{active}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Completed</p>

          <p className="mt-2 text-3xl font-bold">{done}</p>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Recently Updated Tasks</h2>

          <p className="text-sm text-gray-500">
            Latest activity from the sprint board.
          </p>
        </div>

        <DataTable
          data={recentTasks}
          columns={columns}
          getRowKey={(task) => task.id}
        />
      </section>
    </div>
  );
}

export default Dashboard;
