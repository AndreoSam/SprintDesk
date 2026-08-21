import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CompletionTrendChartProps {
  data: {
    date: string;
    completed: number;
  }[];
}

function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis dataKey="date" tickLine={false} />

        <YAxis allowDecimals={false} tickLine={false} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="completed"
          stroke="#16a34a"
          strokeWidth={3}
          dot
          animationDuration={700}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CompletionTrendChart;
