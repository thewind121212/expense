"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatVND } from "@/lib/format";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const ALL = "__all__";

const config = { amount: { label: "Số tiền" } } satisfies ChartConfig;

export function CategoryChart({
  data,
  selected,
  onSelect,
}: {
  data: { category: string; amount: number; pct: number }[];
  selected: string;
  onSelect: (category: string) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // On mobile, tapping a slice leaves it "stuck" (no mouseleave on touch).
  // Clear the highlight/tooltip as soon as the page scrolls.
  useEffect(() => {
    const clear = () => setHover(null);
    window.addEventListener("scroll", clear, { passive: true });
    return () => window.removeEventListener("scroll", clear);
  }, []);

  const isDimmed = (category: string) => selected !== ALL && selected !== category;
  const total = data.reduce((s, d) => s + d.amount, 0);

  // Center reflects the active filter (selected category), else the grand total.
  const selIdx = selected !== ALL ? data.findIndex((d) => d.category === selected) : -1;
  const sel = selIdx >= 0 ? data[selIdx] : null;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div
        className="relative aspect-square h-[220px] w-[220px] shrink-0"
        onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      >
        <ChartContainer config={config} className="aspect-square h-full w-full">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              activeShape={(props) => <Sector {...props} outerRadius={(props.outerRadius ?? 92) + 7} />}
              onClick={(_, i) => onSelect(data[i].category)}
              onMouseEnter={(_, i) => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer focus:outline-none"
            >
              {data.map((d, i) => (
                <Cell
                  key={d.category}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={isDimmed(d.category) ? 0.25 : 1}
                  stroke="var(--background)"
                  strokeWidth={selected === d.category ? 3 : 1}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
          {sel ? (
            <>
              <span className="line-clamp-1 text-[11px] font-medium" style={{ color: COLORS[selIdx % COLORS.length] }}>
                {sel.category}
              </span>
              <span className="text-base font-semibold tabular-nums">{formatVND(sel.amount)}</span>
              <span className="text-[11px] text-muted-foreground tabular-nums">{(sel.pct * 100).toFixed(0)}%</span>
            </>
          ) : (
            <>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Tổng</span>
              <span className="text-base font-semibold tabular-nums">{formatVND(total)}</span>
            </>
          )}
        </div>

        {/* kuru-style floating tooltip: dark box, above the cursor, centered horizontally. */}
        {hover !== null && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-lg bg-slate-900/95 px-2.5 py-2 text-xs text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
            style={{ left: mouse.x, top: mouse.y }}
          >
            <div className="mb-0.5 font-semibold">{data[hover].category}</div>
            <div className="tabular-nums">
              {formatVND(data[hover].amount)} · {(data[hover].pct * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      <ul className="w-full space-y-1.5 text-sm sm:w-auto">
        {data.map((d, i) => (
          <li key={d.category}>
            <button
              type="button"
              onClick={() => onSelect(d.category)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted ${
                isDimmed(d.category) ? "opacity-40" : ""
              } ${selected === d.category ? "bg-muted" : ""}`}
            >
              <span className="size-3 shrink-0 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="flex-1 min-w-[120px]">{d.category}</span>
              <span className="font-medium tabular-nums">{formatVND(d.amount)}</span>
              <span className="w-12 text-right text-muted-foreground tabular-nums">{(d.pct * 100).toFixed(1)}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
