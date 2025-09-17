import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Bill } from "@/types";
import { format } from "date-fns";

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Draft': 'secondary',
  'Pending Alampatti': 'outline',
  'Pending Kappalur': 'outline',
  'Pending Chairman': 'outline',
  'Approved': 'default',
  'Returned': 'destructive',
  'Closed': 'secondary',
};

export default function RecentBills({ bills }: { bills: Bill[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Bills</CardTitle>
          <CardDescription>
            An overview of the most recently created bills.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/bills">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>
                  <div className="font-medium">{bill.vendor.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {bill.invoiceNumber}
                  </div>
                </TableCell>
                <TableCell>{bill.level}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={statusColors[bill.status] || 'default'}>
                    {bill.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(bill.billDate, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">₹{bill.amount.toLocaleString('en-IN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
