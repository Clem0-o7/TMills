
"use client";

import { Bill } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, FileText, Package, Tag, ExternalLink, Edit, Check, X, MessageSquare } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineBody } from '@/components/ui/timeline';
import { useRouter } from 'next/navigation';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Draft': 'secondary',
  'Pending Alampatti': 'outline',
  'Pending Kappalur': 'outline',
  'Pending Chairman': 'outline',
  'Approved': 'default',
  'Returned': 'destructive',
  'Closed': 'secondary',
};

const getActionIcon = (action: string) => {
    switch (action) {
        case 'Created': return <Edit className="h-4 w-4" />;
        case 'Approved': return <Check className="h-4 w-4 text-green-500" />;
        case 'Returned': return <X className="h-4 w-4 text-red-500" />;
        case 'Closed': return <Check className="h-4 w-4" />;
        default: return <MessageSquare className="h-4 w-4" />;
    }
}

interface BillDetailsDialogProps {
  bill: Bill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillDetailsDialog({ bill, open, onOpenChange }: BillDetailsDialogProps) {
    const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Invoice {bill.invoiceNumber}</DialogTitle>
          <DialogDescription>From {bill.vendor.name}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-2 flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                    <Badge variant={statusColors[bill.status]} className="text-base">
                        {bill.status}
                    </Badge>
                     {bill.invoiceUrl && (
                        <Button variant="outline" size="sm" onClick={() => window.open(bill.invoiceUrl, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Invoice
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-start gap-2">
                        <IndianRupee className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-semibold text-lg">₹{bill.amount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Bill Date</p>
                            <p className="font-semibold">{format(bill.billDate, 'PPP')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Package className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Processing Level</p>
                            <p className="font-semibold">{bill.level}</p>
                        </div>
                    </div>
                        <div className="flex items-start gap-2">
                        <Tag className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Vendor ID</p>
                            <p className="font-semibold">{bill.vendor.id}</p>
                        </div>
                    </div>
                </div>
                 <div className="flex gap-2 pt-4 border-t">
                    <Button>Approve</Button>
                    <Button variant="outline">Return with Comments</Button>
                    <Button variant="destructive">Reject</Button>
                </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto pr-2">
                 <h4 className="font-semibold mb-2">Bill History</h4>
                <Timeline>
                    {bill.history.map((item, index) => (
                        <TimelineItem key={index}>
                            <TimelineConnector />
                            <TimelineHeader>
                                <TimelineIcon>{getActionIcon(item.action)}</TimelineIcon>
                                <TimelineTitle>{item.action}</TimelineTitle>
                                <p className="text-xs text-muted-foreground ml-auto">
                                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                </p>
                            </TimelineHeader>
                            <TimelineBody>
                                <p className="text-sm font-medium">{item.actor}</p>
                                {item.notes && <p className="text-sm text-muted-foreground mt-1">"{item.notes}"</p>}
                            </TimelineBody>
                        </TimelineItem>
                    ))}
                </Timeline>
            </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => router.push(`/bills/${bill.id}`)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
