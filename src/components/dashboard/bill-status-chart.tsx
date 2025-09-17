"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { bills } from "@/lib/data"

export default function BillStatusChart() {
  const data = bills.reduce((acc, bill) => {
    const level = bill.level;
    if (!acc[level]) {
      acc[level] = { name: level, "Level 1: Coloring": 0, "Level 2: Washing": 0, "Level 3: Stitching": 0 };
    }
    acc[level][level]++;
    return acc;
  }, {} as Record<string, {name: string, "Level 1: Coloring": number, "Level 2: Washing": number, "Level 3: Stitching": number}>);

  const chartData = Object.values(data);
  const totalBills = bills.length;
  
  const processedData = ['Level 1: Coloring', 'Level 2: Washing', 'Level 3: Stitching'].map(level => {
      const pending = bills.filter(b => b.level === level && (b.status.startsWith('Pending') || b.status === 'Returned')).length;
      const approved = bills.filter(b => b.level === level && (b.status === 'Approved' || b.status === 'Closed')).length;
      return { name: level.split(': ')[1], Pending: pending, Approved: approved };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Overview by Level</CardTitle>
        <CardDescription>
          Count of pending and approved bills in each processing stage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ 
                  background: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="Pending" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Approved" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
