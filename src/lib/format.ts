import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export function formatVND(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";
}

// "2026-06-04" -> "4/6"
export function formatDayShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)}/${Number(m)}`;
}

// "2026-06-04" -> "Thứ tư, 4/6/2026"
export function formatDateLong(iso: string): string {
  const s = format(parseISO(iso), "EEEE, d/M/yyyy", { locale: vi });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
