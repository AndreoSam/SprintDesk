import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusData {
  name: string;
  value: number;
}

interface TaskStatusChartProps {
  data: StatusData[];
}

const COLORS = ["#94a3b8", "#3b82f6", "#f59e0b", "#22c55e"];

function TaskStatusChart({ data }: TaskStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          animationDuration={700}
        >
          {data.map((item, index) => (
            <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default TaskStatusChart;
