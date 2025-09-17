export type Vendor = {
  id: string;
  name: string;
};

export type BillHistory = {
  timestamp: Date;
  action: string;
  actor: string;
  notes?: string;
  reductionAmount?: number;
};

export type Bill = {
  id: string;
  invoiceNumber: string;
  vendor: Vendor;
  billDate: Date;
  amount: number;
  level: 'Coloring' | 'Washing' | 'Stitching';
  status: 'Draft' | 'Pending Alampatti' | 'Pending Kappalur' | 'Pending Chairman' | 'Approved' | 'Returned' | 'Closed';
  history: BillHistory[];
};
