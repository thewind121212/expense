export const CATEGORY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Stable color per category, shared by the donut and the list, based on the
// canonical categories order so a category always keeps the same color.
export function categoryColor(category: string, categories: string[]): string {
  const i = categories.indexOf(category);
  return CATEGORY_COLORS[(i < 0 ? 0 : i) % CATEGORY_COLORS.length];
}
