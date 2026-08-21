import { useMemo } from "react";

import ChartCard from "../components/charts/ChartCard";
import SprintVelocityChart from "../components/charts/SprintVelocityChart";
import TaskStatusChart from "../components/charts/TaskStatusChart";
import PriorityChart from "../components/charts/PriorityChart";
import CompletionTrendChart from "../components/charts/CompletionTrendChart";

import { useBoardTasks } from "../hooks/useBoardTasks";
import { useSprints } from "../hooks/useSprints";

import {
  getCompletionTrendData,
  getPriorityData,
  getSprintVelocityData,
  getStatusData,
} from "../utils/analytics";

function Analytics() {
  const { tasks, isLoading: tasksLoading } = useBoardTasks();

  const { data: sprints = [], isLoading: sprintsLoading } = useSprints();

  const statusData = useMemo(() => getStatusData(tasks), [tasks]);

  const priorityData = useMemo(() => getPriorityData(tasks), [tasks]);

  const velocityData = useMemo(
    () => getSprintVelocityData(tasks, sprints),
    [tasks, sprints],
  );

  const completionData = useMemo(() => getCompletionTrendData(tasks), [tasks]);

  if (tasksLoading || sprintsLoading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Sprint performance and task insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Sprint Velocity"
          description="Completed tasks per sprint"
        >
          <SprintVelocityChart data={velocityData} />
        </ChartCard>

        <ChartCard
          title="Task Status"
          description="Current distribution across the board"
        >
          <TaskStatusChart data={statusData} />
        </ChartCard>

        <ChartCard
          title="Priority Breakdown"
          description="Tasks grouped by priority"
        >
          <PriorityChart data={priorityData} />
        </ChartCard>

        <ChartCard
          title="Completion Trend"
          description="Cumulative task completions over time"
        >
          <CompletionTrendChart data={completionData} />
        </ChartCard>
      </div>
    </div>
  );
}

export default Analytics;
