import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { expenses, CATEGORIES, type Expense } from "@/db/schema";

export type Overview = {
  expenses: Expense[];
  categories: string[];
  total: number;
  count: number;
  daysWithSpend: number;
  avgPerDay: number;
  perDay: { date: string; amount: number }[];
  perCategory: { category: string; amount: number; pct: number }[];
};

export async function getOverview(): Promise<Overview> {
  const rows = await db
    .select()
    .from(expenses)
    .orderBy(desc(expenses.date), asc(expenses.id));

  const total = rows.reduce((s, r) => s + r.amount, 0);

  const dayMap = new Map<string, number>();
  for (const r of rows) dayMap.set(r.date, (dayMap.get(r.date) ?? 0) + r.amount);
  const perDay = [...dayMap.entries()]
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const catMap = new Map<string, number>();
  for (const r of rows) catMap.set(r.category, (catMap.get(r.category) ?? 0) + r.amount);
  const perCategory = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount, pct: total > 0 ? amount / total : 0 }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Default categories plus any user-created ones already present in the data.
  const categories = [...new Set<string>([...CATEGORIES, ...catMap.keys()])];

  const daysWithSpend = perDay.filter((d) => d.amount > 0).length;
  const avgPerDay = daysWithSpend > 0 ? total / daysWithSpend : 0;

  return {
    expenses: rows,
    categories,
    total,
    count: rows.length,
    daysWithSpend,
    avgPerDay,
    perDay,
    perCategory,
  };
}
