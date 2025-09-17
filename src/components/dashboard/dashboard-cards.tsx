import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bills } from "@/lib/data";
import { DollarSign, FileClock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { differenceInDays } from "date-fns";

export default function DashboardCards() {
  const totalPendingAmount = bills
    .filter(bill => bill.status !== 'Closed' && bill.status !== 'Approved')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const pendingApprovalCount = bills.filter(bill => 
    bill.status === 'Pending Alampatti' || 
    bill.status === 'Pending Kappalur' || 
    bill.status === 'Pending Chairman'
  ).length;

  const overdueBillsCount = bills.filter(bill => 
    bill.status !== 'Closed' && 
    differenceInDays(new Date(), bill.billDate) > 20
  ).length;

  const closedThisMonthCount = bills.filter(bill => {
    const closedAction = bill.history.find(h => h.action === 'Closed');
    if (!closedAction) return false;
    const today = new Date();
    return closedAction.timestamp.getMonth() === today.getMonth() && closedAction.timestamp.getFullYear() === today.getFullYear();
  }).length;


  const cardData = [
    {
      title: "Total Pending Amount",
      value: `₹${(totalPendingAmount / 100000).toFixed(2)} L`,
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      title: "Bills Pending Approval",
      value: pendingApprovalCount,
      icon: FileClock,
      color: "text-yellow-500",
    },
    {
      title: "Overdue Bills (> 20 days)",
      value: overdueBillsCount,
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Closed this Month",
      value: closedThisMonthCount,
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
