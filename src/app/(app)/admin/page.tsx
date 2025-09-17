import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Administrative Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
            <Settings className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">
              User management and system settings will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
