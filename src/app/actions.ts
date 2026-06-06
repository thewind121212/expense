"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { expenses, CATEGORIES, type Category } from "@/db/schema";

function parseForm(formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const item = String(formData.get("item") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim();

  if (!date) throw new Error("Thiếu ngày");
  if (!item) throw new Error("Thiếu hạng mục");
  if (!CATEGORIES.includes(category as Category)) throw new Error("Danh mục không hợp lệ");
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Số tiền không hợp lệ");

  return { date, item, category, amount: Math.round(amount), note: note || null };
}

export async function addExpense(formData: FormData) {
  const data = parseForm(formData);
  await db.insert(expenses).values(data);
  revalidatePath("/");
}

export async function updateExpense(id: number, formData: FormData) {
  const data = parseForm(formData);
  await db.update(expenses).set(data).where(eq(expenses.id, id));
  revalidatePath("/");
}

export async function deleteExpense(id: number) {
  await db.delete(expenses).where(eq(expenses.id, id));
  revalidatePath("/");
}
