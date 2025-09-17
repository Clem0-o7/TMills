
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bills as initialBills } from "@/lib/data";
import type { Bill, BillStatus, UserRole } from "@/types";
import { format, differenceInDays } from "date-fns";
import { MoreHorizontal, ArrowUpDown, ChevronsUpDown, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { BillFormDialog } from "./bill-form-dialog";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


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


export default function BillsTable() {
  const [bills, setBills] = React.useState<Bill[]>(initialBills);
  const [filters, setFilters] = React.useState({ search: "", status: "all", level: "all" });
  const [sort, setSort] = React.useState<{ key: keyof Bill | 'age' | 'vendorName', direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSort = (key: keyof Bill | 'age' | 'vendorName') => {
    if (sort && sort.key === key && sort.direction === 'desc') {
      setSort(null);
    } else {
      setSort({ key, direction: sort?.direction === 'asc' ? 'desc' : 'asc' });
    }
  };

  const filteredBills = React.useMemo(() => {
    let filtered = bills.filter(bill => {
      const searchMatch = filters.search === "" || bill.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) || bill.vendor.name.toLowerCase().includes(filters.search.toLowerCase());
      const statusMatch = filters.status === "all" || bill.status === filters.status;
      const levelMatch = filters.level === "all" || bill.level === filters.level;
      return searchMatch && statusMatch && levelMatch;
    });

    if (sort) {
      filtered.sort((a, b) => {
        let valA, valB;
        if (sort.key === 'age') {
            valA = differenceInDays(new Date(), a.billDate);
            valB = differenceInDays(new Date(), b.billDate);
        } else if (sort.key === 'vendorName') {
            valA = a.vendor.name;
            valB = b.vendor.name;
        } else if (sort.key === 'level') {
            valA = parseInt(a.level.split(':')[0].replace('Level ', ''), 10);
            valB = parseInt(b.level.split(':')[0].replace('Level ', ''), 10);
        } else {
            valA = a[sort.key as keyof Bill];
            valB = b[sort.key as keyof Bill];
        }

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [bills, filters, sort]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredBills.map(b => b.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
  };
  
  const addBill = (newBillData: Omit<Bill, 'id' | 'history' | 'status'>) => {
      const newBill: Bill = {
        ...newBillData,
        id: `BILL-${Math.random().toString(36).substr(2, 9)}`,
        status: 'Pending Alampatti',
        history: [{
            action: 'Created',
            actor: user!.role,
            timestamp: new Date()
        }]
      };
      setBills(prev => [newBill, ...prev]);
  };
  
  const handleAction = (billId: string, action: 'approve' | 'return') => {
    setBills(prev => prev.map(bill => {
        if (bill.id === billId && user) {
            let newStatus = bill.status;
            let historyAction = '';
            if (action === 'approve') {
                if (bill.status === 'Pending Alampatti') newStatus = 'Pending Kappalur';
                else if (bill.status === 'Pending Kappalur') newStatus = 'Pending Chairman';
                else if (bill.status === 'Pending Chairman') newStatus = 'Approved';
                historyAction = 'Approved';
            } else if (action === 'return') {
                newStatus = 'Returned';
                historyAction = 'Returned';
            }

            if (newStatus !== bill.status) {
                toast({ title: `Bill ${historyAction}`, description: `Bill ${bill.invoiceNumber} has been ${historyAction.toLowerCase()}.` });
                return {
                    ...bill,
                    status: newStatus,
                    history: [...bill.history, { action: historyAction, actor: user.role, timestamp: new Date() }]
                };
            }
        }
        return bill;
    }));
  };
  
  const handleBulkAction = (action: 'approve' | 'return' | 'delete') => {
    const validRows = Array.from(selectedRows).filter(id => {
        const bill = bills.find(b => b.id === id);
        if (!bill || !user) return false;
        if (action === 'approve') return canApprove(bill, user.role);
        if (action === 'return') return canReturn(bill, user.role);
        return true;
    });

    if (action === 'delete') {
        setBills(prev => prev.filter(b => !validRows.includes(b.id)));
        toast({ title: 'Bills Deleted', description: `${validRows.length} bills have been deleted.` });
    } else {
        setBills(prev => prev.map(bill => {
            if (validRows.includes(bill.id)) {
                let newStatus = bill.status;
                if (action === 'approve') {
                    if (bill.status === 'Pending Alampatti') newStatus = 'Pending Kappalur';
                    else if (bill.status === 'Pending Kappalur') newStatus = 'Pending Chairman';
                    else if (bill.status === 'Pending Chairman') newStatus = 'Approved';
                } else if (action === 'return') {
                    newStatus = 'Returned';
                }
                return {
                    ...bill,
                    status: newStatus,
                    history: [...bill.history, { action: action === 'approve' ? 'Approved' : 'Returned', actor: user!.role, timestamp: new Date() }]
                };
            }
            return bill;
        }));
        toast({ title: `Bills ${action}d`, description: `${validRows.length} bills have been ${action}d.` });
    }
    setSelectedRows(new Set());
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <Input
            placeholder="Filter by invoice or vendor..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="max-w-sm"
          />
          <div className="flex gap-4">
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {[...new Set(initialBills.map(b => b.status))].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({...prev, level: value}))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Level 1: Coloring">Level 1: Coloring</SelectItem>
                <SelectItem value="Level 2: Washing">Level 2: Washing</SelectItem>
                <SelectItem value="Level 3: Stitching">Level 3: Stitching</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {selectedRows.size > 0 && (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Bulk Actions ({selectedRows.size})
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleBulkAction('approve')}><CheckCircle className="mr-2 h-4 w-4" />Approve Selected</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('return')}><RotateCcw className="mr-2 h-4 w-4" />Return Selected</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleBulkAction('delete')}><Trash2 className="mr-2 h-4 w-4" />Delete Selected</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
            )}
            {user.role === 'Accounts Manager (Alampatti)' && <BillFormDialog onSave={addBill} />}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedRows.size > 0 && selectedRows.size === filteredBills.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('vendorName')}>
                        Vendor <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('level')}>
                    Level <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('billDate')}>
                        Bill Date <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('age')}>
                        Age <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => handleSort('amount')}>
                        Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => {
                const age = differenceInDays(new Date(), bill.billDate);
                const userCanApprove = canApprove(bill, user.role);
                const userCanReturn = canReturn(bill, user.role);
                return (
                  <TableRow key={bill.id} data-state={selectedRows.has(bill.id) ? "selected" : ""}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.has(bill.id)} 
                        onCheckedChange={(checked) => handleSelectRow(bill.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{bill.invoiceNumber}</TableCell>
                    <TableCell>{bill.vendor.name}</TableCell>
                    <TableCell>{bill.level}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[bill.status] || 'default'}>{bill.status}</Badge>
                    </TableCell>
                    <TableCell>{format(bill.billDate, "dd/MM/yyyy")}</TableCell>
                    <TableCell className={getAgeColor(age)}>{age} days</TableCell>
                    <TableCell className="text-right">₹{bill.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/bills/${bill.id}`)}>View Details</DropdownMenuItem>
                          {userCanApprove && <DropdownMenuItem onClick={() => handleAction(bill.id, 'approve')}>Approve</DropdownMenuItem>}
                          <DropdownMenuItem>Suggest Modification</DropdownMenuItem>
                          {userCanReturn && <DropdownMenuItem onClick={() => handleAction(bill.id, 'return')}>Return</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
