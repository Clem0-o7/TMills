
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { bills as initialBills } from "@/lib/data";
import type { Bill, BillStatus, UserRole } from "@/types";
import { differenceInDays } from "date-fns";
import BillCard from "./bill-card";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { BillFormDialog } from "./bill-form-dialog";

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


export default function BillsGrid() {
  const [bills, setBills] = React.useState<Bill[]>(initialBills);
  const [filters, setFilters] = React.useState({ search: "", status: "all", level: "all" });
  const [sort, setSort] = React.useState<{ key: 'amount' | 'age', direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

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
        } else { // amount
            valA = a.amount;
            valB = b.amount;
        }

        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [bills, filters, sort]);

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
        }],
        invoiceUrl: 'https://placehold.co/600x800.pdf',
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
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Bills</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
            <Input
                placeholder="Filter by invoice or vendor..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="max-w-sm"
            />
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
                <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {[...new Set(initialBills.map(b => b.status))].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({...prev, level: value}))}>
                <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Level 1: Coloring">Level 1: Coloring</SelectItem>
                <SelectItem value="Level 2: Washing">Level 2: Washing</SelectItem>
                <SelectItem value="Level 3: Stitching">Level 3: Stitching</SelectItem>
                </SelectContent>
            </Select>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBills.map(bill => (
                <BillCard 
                    key={bill.id} 
                    bill={bill} 
                    userRole={user.role}
                    isSelected={selectedRows.has(bill.id)}
                    onSelect={handleSelectRow}
                    onAction={handleAction}
                />
            ))}
        </div>
        {filteredBills.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
                No bills found that match your criteria.
            </div>
        )}
    </div>
  )
}
