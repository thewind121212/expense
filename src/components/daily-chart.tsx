"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatDayShort, formatVND } from "@/lib/format";

const config = {
  amount: { label: "Số tiền", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function DailyChart({ data }: { data: { date: string; amount: number }[] }) {
  const chartData = data.map((d) => ({ day: formatDayShort(d.date), amount: d.amount }));

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <BarChart data={chartData} margin={{ left: 4, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(v) => formatVND(Number(v))} />}
        />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
