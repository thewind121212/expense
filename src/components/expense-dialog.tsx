"use client";

import { useState } from "react";
import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type Expense } from "@/db/schema";
import { addExpense, updateExpense } from "@/app/actions";
import { cn } from "@/lib/utils";

const toISO = (d: Date) => format(d, "yyyy-MM-dd");
const fromISO = (s: string) => parse(s, "yyyy-MM-dd", new Date());

export function ExpenseDialog({
  expense,
  trigger,
}: {
  expense?: Expense;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState<Date>(expense?.date ? fromISO(expense.date) : new Date(2026, 5, 6));
  const [amount, setAmount] = useState<number>(expense?.amount ?? 0);
  const isEdit = Boolean(expense);

  async function onSubmit(formData: FormData) {
    setPending(true);
    try {
      if (expense) await updateExpense(expense.id, formData);
      else await addExpense(formData);
      toast.success(isEdit ? "Đã cập nhật khoản chi" : "Đã thêm khoản chi");
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[440px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Sửa khoản chi" : "Thêm khoản chi"}</DialogTitle>
            <DialogDescription>Đơn vị: đồng (đ)</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item">Hạng mục</Label>
              <Input id="item" name="item" defaultValue={expense?.item} placeholder="vd: Ghẹ, Xe taxi" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="date">Ngày</Label>
                <input type="hidden" name="date" value={toISO(date)} />
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className={cn("justify-start gap-2 font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="size-4" />
                        {format(date, "dd/MM/yyyy")}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={vi}
                      selected={date}
                      defaultMonth={date}
                      onSelect={(d) => {
                        if (d) {
                          setDate(d);
                          setDateOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Số tiền</Label>
                <input type="hidden" name="amount" value={amount} />
                <div className="relative">
                  <Input
                    id="amount"
                    inputMode="numeric"
                    autoComplete="off"
                    value={amount ? new Intl.NumberFormat("vi-VN").format(amount) : ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setAmount(digits ? Number(digits) : 0);
                    }}
                    placeholder="0"
                    className="pr-7 tabular-nums"
                    required
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    đ
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select name="category" defaultValue={expense?.category ?? CATEGORIES[0]}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input id="note" name="note" defaultValue={expense?.note ?? ""} placeholder="tuỳ chọn (vd: Hải sản)" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Đang lưu..." : isEdit ? "Lưu" : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
