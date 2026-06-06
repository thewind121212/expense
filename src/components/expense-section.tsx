"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CATEGORIES, type Expense } from "@/db/schema";
import { deleteExpense } from "@/app/actions";
import { formatDayShort, formatVND } from "@/lib/format";
import { ExpenseDialog } from "./expense-dialog";

export const ALL = "__all__";

export function ExpenseSection({
  expenses,
  cat,
  onCatChange,
}: {
  expenses: Expense[];
  cat: string;
  onCatChange: (v: string) => void;
}) {
  const [day, setDay] = useState<string>(ALL);
  const [isPending, startTransition] = useTransition();

  const days = useMemo(
    () => [...new Set(expenses.map((e) => e.date))].sort(),
    [expenses]
  );

  const filtered = useMemo(
    () =>
      expenses.filter(
        (e) => (cat === ALL || e.category === cat) && (day === ALL || e.date === day)
      ),
    [expenses, cat, day]
  );

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

  function onDelete(id: number) {
    if (!confirm("Xoá khoản chi này?")) return;
    startTransition(async () => {
      try {
        await deleteExpense(id);
        toast.success("Đã xoá");
      } catch {
        toast.error("Xoá thất bại");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Danh sách chi tiêu</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={cat} onValueChange={(v) => onCatChange(v ?? ALL)}>
            <SelectTrigger className="w-[170px]" size="sm">
              <SelectValue>{(v) => (v === ALL ? "Tất cả danh mục" : v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tất cả danh mục</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={day} onValueChange={(v) => setDay(v ?? ALL)}>
            <SelectTrigger className="w-[130px]" size="sm">
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

          <ExpenseDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" /> Thêm khoản chi
              </Button>
            }
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-2 text-sm text-muted-foreground">
          {filtered.length} khoản · {formatVND(filteredTotal)}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">Ngày</TableHead>
                <TableHead>Hạng mục</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead className="w-[88px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Không có khoản chi nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((e) => (
                  <TableRow key={e.id} className={isPending ? "opacity-60" : undefined}>
                    <TableCell className="tabular-nums">{formatDayShort(e.date)}</TableCell>
                    <TableCell className="font-medium">{e.item}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell className="text-muted-foreground">{e.note}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatVND(e.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <ExpenseDialog
                          expense={e}
                          trigger={
                            <Button variant="ghost" size="icon" className="size-8">
                              <Pencil className="size-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive"
                          onClick={() => onDelete(e.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
