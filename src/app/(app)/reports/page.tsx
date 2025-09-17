import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Reporting Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
            <BarChart3 className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">
              Advanced reporting and analytics features are coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
