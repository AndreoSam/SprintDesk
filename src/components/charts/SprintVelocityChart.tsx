import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SprintVelocityChartProps {
  data: {
    sprint: string;
    completed: number;
  }[];
}

function SprintVelocityChart({ data }: SprintVelocityChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis dataKey="sprint" tickLine={false} />

        <YAxis allowDecimals={false} tickLine={false} />

        <Tooltip />

        <Bar
          dataKey="completed"
          fill="#2563eb"
          radius={[6, 6, 0, 0]}
          animationDuration={700}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SprintVelocityChart;
