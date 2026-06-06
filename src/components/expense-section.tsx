"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Expense } from "@/db/schema";
import { formatDateLong, formatDayShort, formatVND } from "@/lib/format";
import { categoryColor } from "@/lib/colors";
import { ExpenseDialog } from "./expense-dialog";

export const ALL = "__all__";

export function ExpenseSection({
  expenses,
  categories,
  cat,
  onCatChange,
}: {
  expenses: Expense[];
  categories: string[];
  cat: string;
  onCatChange: (v: string) => void;
}) {
  const [day, setDay] = useState<string>(ALL);

  const days = useMemo(() => [...new Set(expenses.map((e) => e.date))].sort(), [expenses]);

  const filtered = useMemo(
    () =>
      expenses.filter(
        (e) => (cat === ALL || e.category === cat) && (day === ALL || e.date === day)
      ),
    [expenses, cat, day]
  );

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

  // Group filtered expenses by day, newest day first.
  const groups = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const e of filtered) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return [...map.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, items]) => ({
        date,
        items,
        total: items.reduce((s, e) => s + e.amount, 0),
      }));
  }, [filtered]);

  return (
    <>
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-3">
          <CardTitle className="min-w-0 truncate text-lg">Danh sách chi tiêu</CardTitle>
          <ExpenseDialog
            categories={categories}
            trigger={
              <Button className="hidden shrink-0 sm:inline-flex sm:h-11 sm:px-5 sm:text-base">
                <Plus className="size-5" /> Thêm khoản chi
              </Button>
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={cat} onValueChange={(v) => onCatChange(v ?? ALL)}>
            <SelectTrigger className="w-[180px]" size="sm">
              <Tag className="size-4 shrink-0 text-muted-foreground" />
              <SelectValue>{(v) => (v === ALL ? "Tất cả danh mục" : v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tất cả danh mục</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={day} onValueChange={(v) => setDay(v ?? ALL)}>
            <SelectTrigger className="w-[150px]" size="sm">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              <SelectValue>{(v) => (v === ALL ? "Tất cả ngày" : formatDayShort(v))}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tất cả ngày</SelectItem>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {formatDayShort(d)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          {filtered.length} khoản · {formatVND(filteredTotal)} · chạm vào dòng để sửa / xoá
        </div>

        {groups.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            Không có khoản chi nào
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.date} className="overflow-hidden rounded-xl border">
              <header className="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-2.5">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate text-sm font-semibold">{formatDateLong(g.date)}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">· {g.items.length} khoản</span>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">{formatVND(g.total)}</span>
              </header>
              <ul className="divide-y">
                {g.items.map((e) => (
                  <li key={e.id}>
                    <ExpenseDialog
                      expense={e}
                      categories={categories}
                      trigger={
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                        >
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ background: categoryColor(e.category, categories) }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{e.item}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {e.category}
                              {e.note ? ` · ${e.note}` : ""}
                            </div>
                          </div>
                          <div className="shrink-0 font-medium tabular-nums">{formatVND(e.amount)}</div>
                        </button>
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </CardContent>
    </Card>

    {/* Mobile floating action button */}
    <ExpenseDialog
      categories={categories}
      trigger={
        <Button
          size="icon"
          aria-label="Thêm khoản chi"
          className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg sm:hidden"
        >
          <Plus className="size-6" />
        </Button>
      }
    />
    </>
  );
}
