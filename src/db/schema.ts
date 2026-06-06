import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const CATEGORIES = ["Ăn uống", "Đi lại", "Tiền phòng", "Giải trí", "Đồ dùng & tạp hóa"] as const;
export type Category = (typeof CATEGORIES)[number];

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  // ngày chi tiêu, lưu dạng YYYY-MM-DD
  date: text("date").notNull(),
  // hạng mục (vd: "Xe taxi", "Mực")
  item: text("item").notNull(),
  // danh mục (Ăn uống / Di chuyển / Đồ dùng & tạp hóa)
  category: text("category").notNull(),
  // số tiền, đơn vị đồng (số nguyên)
  amount: integer("amount").notNull(),
  // ghi chú (tuỳ chọn)
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
