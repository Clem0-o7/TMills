
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bill, BillStatus, UserRole } from "@/types";
import { format, differenceInDays } from "date-fns";
import { Calendar, IndianRupee, GanttChartSquare, FileText, CheckCircle, RotateCcw, Eye, ExternalLink } from "lucide-react";
import { BillDetailsDialog } from './bill-details-dialog';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Draft': 'secondary',
  'Pending Alampatti': 'outline',
  'Pending Kappalur': 'outline',
  'Pending Chairman': 'outline',
  'Approved': 'default',
  'Returned': 'destructive',
  'Closed': 'secondary',
};

const getAgeColor = (age: number) => {
  if (age > 20) return "text-destructive";
  if (age > 15) return "text-yellow-600 dark:text-yellow-400";
  return "text-muted-foreground";
};

const canApprove = (bill: Bill, role: UserRole): boolean => {
    if (!role) return false;
    const approvalMatrix: Record<BillStatus, UserRole | null> = {
        'Draft': 'Accounts Manager (Alampatti)',
        'Pending Alampatti': 'Accounts Manager (Alampatti)',
        'Pending Kappalur': 'Accounts Manager (Kappalur)',
        'Pending Chairman': 'Chairman',
        'Approved': null,
        'Returned': null,
        'Closed': null,
    };
    return approvalMatrix[bill.status] === role;
};

const canReturn = (bill: Bill, role: UserRole): boolean => {
    if (!role || bill.status === 'Draft' || bill.status === 'Approved' || bill.status === 'Closed' || bill.status === 'Returned') return false;
    const returnRoles: UserRole[] = ['Accounts Manager (Kappalur)', 'Chairman'];
    return returnRoles.includes(role);
};

interface BillCardProps {
    bill: Bill;
    userRole: UserRole;
    isSelected: boolean;
    onSelect: (id: string, checked: boolean) => void;
    onAction: (billId: string, action: 'approve' | 'return') => void;
}

export default function BillCard({ bill, userRole, isSelected, onSelect, onAction }: BillCardProps) {
    const age = differenceInDays(new Date(), bill.billDate);
    const userCanApprove = canApprove(bill, userRole);
    const userCanReturn = canReturn(bill, userRole);
    const [isDetailsOpen, setDetailsOpen] = useState(false);

    return (
        <>
            <Card className={`transition-all ${isSelected ? 'border-primary ring-2 ring-primary' : ''}`}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => onSelect(bill.id, !!checked)}
                                    className="mr-2"
                                />
                                {bill.invoiceNumber}
                            </CardTitle>
                            <CardDescription>{bill.vendor.name}</CardDescription>
                        </div>
                        <Badge variant={statusColors[bill.status] || 'default'}>{bill.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                     <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">₹{bill.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GanttChartSquare className="h-4 w-4 text-muted-foreground" />
                        <span>{bill.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(bill.billDate, "dd MMM, yyyy")}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${getAgeColor(age)}`}>
                        <span className="font-medium">{age} days old</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        {userCanApprove && (
                            <Button size="sm" onClick={() => onAction(bill.id, 'approve')}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </Button>
                        )}
                        {userCanReturn && (
                             <Button size="sm" variant="outline" onClick={() => onAction(bill.id, 'return')}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Return
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                         {bill.invoiceUrl && (
                            <Button size="sm" variant="ghost" onClick={() => window.open(bill.invoiceUrl, '_blank')}>
                                <FileText className="mr-2 h-4 w-4" /> Invoice
                            </Button>
                         )}
                        <Button size="sm" variant="outline" onClick={() => setDetailsOpen(true)}>
                            <Eye className="mr-2 h-4 w-4" /> Details
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            <BillDetailsDialog bill={bill} open={isDetailsOpen} onOpenChange={setDetailsOpen} />
        </>
    );
}
