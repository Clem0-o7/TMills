import BillAgingChart from "@/components/dashboard/bill-aging-chart";
import BillStatusChart from "@/components/dashboard/bill-status-chart";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import RecentBills from "@/components/dashboard/recent-bills";
import { bills } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BillStatusChart />
        </div>
        <div className="lg:col-span-2">
          <BillAgingChart />
        </div>
      </div>
      
      <RecentBills bills={bills.slice(0, 5)} />

    </div>
  );
}
