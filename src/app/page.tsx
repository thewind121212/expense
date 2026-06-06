import { CalendarDays, Receipt, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dashboard } from "@/components/dashboard";
import { getOverview } from "@/lib/queries";
import { formatVND } from "@/lib/format";

export const dynamic = "force-dynamic";

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-1">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold tabular-nums">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const o = await getOverview();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý chi tiêu — Du lịch Quy Nhơn (5N4Đ)</h1>
        <p className="text-sm text-muted-foreground">Tháng 6/2026 · đơn vị: đồng (đ)</p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          icon={Wallet}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
          label="Tổng chi tiêu"
          value={formatVND(o.total)}
        />
        <Stat
          icon={CalendarDays}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          label="Số ngày đã đi"
          value={String(o.daysWithSpend)}
        />
        <Stat
          icon={TrendingUp}
          color="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
          label="Trung bình / ngày"
          value={formatVND(o.avgPerDay)}
        />
        <Stat
          icon={Receipt}
          color="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
          label="Số giao dịch"
          value={String(o.count)}
        />
      </section>

      <Dashboard overview={o} />
    </main>
  );
}
