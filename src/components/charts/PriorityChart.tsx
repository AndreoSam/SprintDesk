import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PriorityChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

function PriorityChart({ data }: PriorityChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />

        <XAxis type="number" allowDecimals={false} />

        <YAxis type="category" dataKey="name" width={70} />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#8b5cf6"
          radius={[0, 6, 6, 0]}
          animationDuration={700}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PriorityChart;
