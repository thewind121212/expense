"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { type Expense } from "@/db/schema";
import { formatDayShort, formatVND } from "@/lib/format";
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

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">Danh sách chi tiêu</CardTitle>
          <ExpenseDialog
            categories={categories}
            trigger={
              <Button size="lg" className="h-11 px-5 text-base">
                <Plus className="size-5" />
                <span className="hidden sm:inline">Thêm khoản chi</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={cat} onValueChange={(v) => onCatChange(v ?? ALL)}>
            <SelectTrigger className="w-[170px]" size="sm">
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
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-2 text-sm text-muted-foreground">
          {filtered.length} khoản · {formatVND(filteredTotal)} · chạm vào dòng để sửa / xoá
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Ngày</TableHead>
              <TableHead>Hạng mục</TableHead>
              <TableHead className="hidden sm:table-cell">Danh mục</TableHead>
              <TableHead className="hidden md:table-cell">Ghi chú</TableHead>
              <TableHead className="whitespace-nowrap text-right">Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Không có khoản chi nào
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((e) => (
                <ExpenseDialog
                  key={e.id}
                  expense={e}
                  categories={categories}
                  trigger={
                    <TableRow className="cursor-pointer">
                      <TableCell className="whitespace-nowrap tabular-nums">{formatDayShort(e.date)}</TableCell>
                      <TableCell className="font-medium">{e.item}</TableCell>
                      <TableCell className="hidden sm:table-cell">{e.category}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">{e.note}</TableCell>
                      <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                        {formatVND(e.amount)}
                      </TableCell>
                    </TableRow>
                  }
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
