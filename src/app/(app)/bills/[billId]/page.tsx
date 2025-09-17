
"use client";

import { useParams, useRouter } from 'next/navigation';
import { bills as initialBills } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Edit, FileText, IndianRupee, MessageSquare, Package, Tag, User, X, ExternalLink } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineBody } from '@/components/ui/timeline';

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


export default function BillDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const billId = params.billId as string;

  const bill = initialBills.find(b => b.id === billId);

  if (!bill) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Bill not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Bill Details
            </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Invoice {bill.invoiceNumber}</CardTitle>
                                <CardDescription>From {bill.vendor.name}</CardDescription>
                            </div>
                             <div className="flex items-center gap-2">
                                {bill.invoiceUrl && (
                                <Button variant="outline" size="sm" onClick={() => window.open(bill.invoiceUrl, '_blank')}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Invoice
                                </Button>
                                )}
                                <Badge variant={statusColors[bill.status]} className="text-base">
                                    {bill.status}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="flex items-center gap-2">
                                <IndianRupee className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Amount</p>
                                    <p className="font-semibold text-lg">₹{bill.amount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Bill Date</p>
                                    <p className="font-semibold">{format(bill.billDate, 'PPP')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Processing Level</p>
                                    <p className="font-semibold">{bill.level}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Vendor ID</p>
                                    <p className="font-semibold">{bill.vendor.id}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <div className="flex gap-2">
                            <Button>Approve</Button>
                            <Button variant="outline">Return with Comments</Button>
                            <Button variant="destructive">Reject</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Bill History</CardTitle>
                        <CardDescription>Timeline of actions on this bill.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
