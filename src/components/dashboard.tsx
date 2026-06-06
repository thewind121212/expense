"use client";

import { useState } from "react";
import { BarChart3, ChartPie } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyChart } from "@/components/daily-chart";
import { CategoryChart } from "@/components/category-chart";
import { ExpenseSection, ALL } from "@/components/expense-section";
import type { Overview } from "@/lib/queries";

export function Dashboard({ overview }: { overview: Overview }) {
  const [cat, setCat] = useState<string>(ALL);

  // Clicking the selected category again clears the filter.
  const selectCategory = (c: string) => setCat((prev) => (prev === c ? ALL : c));

  return (
    <>
      <section className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" /> Chi tiêu theo ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyChart data={overview.perDay} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie className="size-4 text-muted-foreground" /> Chi tiêu theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart data={overview.perCategory} selected={cat} onSelect={selectCategory} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <ExpenseSection expenses={overview.expenses} cat={cat} onCatChange={setCat} />
      </section>
    </>
  );
}
