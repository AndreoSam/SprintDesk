import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold text-gray-900">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="h-[300px] w-full">{children}</div>
    </section>
  );
}

export default ChartCard;
