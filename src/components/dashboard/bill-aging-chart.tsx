"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { bills } from "@/lib/data"
import { differenceInDays } from "date-fns"

export default function BillAgingChart() {
  const agingData = [
    { name: '0-10 Days', value: 0 },
    { name: '11-20 Days', value: 0 },
    { name: '21-30 Days', value: 0 },
    { name: '> 30 Days', value: 0 },
  ];

  bills.forEach(bill => {
    if (bill.status === 'Closed') return;
    const age = differenceInDays(new Date(), bill.billDate);
    if (age <= 10) agingData[0].value++;
    else if (age <= 20) agingData[1].value++;
    else if (age <= 30) agingData[2].value++;
    else agingData[3].value++;
  });

  const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-1))', 'hsl(var(--destructive))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Bill Aging</CardTitle>
        <CardDescription>Distribution of pending bills by age.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={agingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {agingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  background: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
