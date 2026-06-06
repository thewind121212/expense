import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { expenses, type NewExpense } from "./schema";

const D4 = "2026-06-04";
const D5 = "2026-06-05";
const D6 = "2026-06-06";

const rows: NewExpense[] = [
  { date: D4, item: "Xe taxi", category: "Di chuyển", amount: 200000 },
  { date: D4, item: "Mực", category: "Ăn uống", amount: 350000, note: "Hải sản" },
  { date: D4, item: "Tôm", category: "Ăn uống", amount: 340000, note: "Hải sản" },
  { date: D4, item: "Tôm lột", category: "Ăn uống", amount: 130000, note: "Hải sản" },
  { date: D4, item: "Cua", category: "Ăn uống", amount: 300000, note: "Hải sản" },
  { date: D4, item: "Ăn tối", category: "Ăn uống", amount: 130000 },
  { date: D4, item: "Ăn cơm", category: "Ăn uống", amount: 100000 },

  { date: D5, item: "Bánh canh + bánh cuốn Tây Sơn", category: "Ăn uống", amount: 70000, note: "Ăn sáng" },
  { date: D5, item: "Mì gói", category: "Đồ dùng & tạp hóa", amount: 100000, note: "Ăn sáng / dự trữ" },
  { date: D5, item: "Bột giặt", category: "Đồ dùng & tạp hóa", amount: 19000 },
  { date: D5, item: "Dầu ăn", category: "Đồ dùng & tạp hóa", amount: 21000 },
  { date: D5, item: "Cafe", category: "Ăn uống", amount: 113000, note: "Ăn sáng" },
  { date: D5, item: "Kem", category: "Ăn uống", amount: 92000 },
  { date: D5, item: "Nước uống", category: "Ăn uống", amount: 95000 },
  { date: D5, item: "Ghẹ", category: "Ăn uống", amount: 400000, note: "Hải sản" },
  { date: D5, item: "Ốc hương", category: "Ăn uống", amount: 400000, note: "Hải sản" },
  { date: D5, item: "Tôm biển", category: "Ăn uống", amount: 220000, note: "Hải sản" },
  { date: D5, item: "Bánh tráng", category: "Ăn uống", amount: 40000 },
  { date: D5, item: "Chôm chôm", category: "Ăn uống", amount: 80000, note: "Trái cây" },
  { date: D5, item: "Tiền xe đi về", category: "Di chuyển", amount: 60000 },
  { date: D5, item: "Đường, mắm", category: "Đồ dùng & tạp hóa", amount: 22000, note: "Gia vị" },
  { date: D5, item: "Rau bí, cà, cần", category: "Ăn uống", amount: 35000 },
  { date: D5, item: "Bánh tráng", category: "Ăn uống", amount: 25000 },

  { date: D6, item: "Xe đi về", category: "Di chuyển", amount: 54000 },
  { date: D6, item: "Ổi, mận", category: "Ăn uống", amount: 65000, note: "Trái cây" },
  { date: D6, item: "Chả cá bánh canh", category: "Ăn uống", amount: 220000 },
  { date: D6, item: "Thịt", category: "Ăn uống", amount: 150000 },
  { date: D6, item: "Chôm chôm", category: "Ăn uống", amount: 70000, note: "Trái cây" },
  { date: D6, item: "Chè + nem", category: "Ăn uống", amount: 75000 },
  { date: D6, item: "Đậu + tàu hũ", category: "Ăn uống", amount: 55000 },
  { date: D6, item: "Mắm", category: "Đồ dùng & tạp hóa", amount: 40000, note: "Gia vị" },
  { date: D6, item: "Thơm (trái)", category: "Ăn uống", amount: 25000, note: "Trái cây" },
  { date: D6, item: "Rau cải, hành", category: "Ăn uống", amount: 21000 },
  { date: D6, item: "Cafe Effoc", category: "Ăn uống", amount: 220000 },
  { date: D6, item: "Giấy vệ sinh", category: "Đồ dùng & tạp hóa", amount: 20000 },
];

async function main() {
  console.log(`Seeding ${rows.length} expenses...`);
  await db.delete(expenses);
  await db.insert(expenses).values(rows);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  console.log(`Done. Inserted ${rows.length} rows, tổng = ${total.toLocaleString("vi-VN")}đ`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
