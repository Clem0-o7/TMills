
export type Vendor = {
  id: string;
  name: string;
};

export type UserRole = 'Accounts Manager (Alampatti)' | 'Accounts Manager (Kappalur)' | 'Chairman';

export type UserDefinition = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
};

export type BillHistory = {
  timestamp: Date;
  action: string;
  actor: UserRole | 'System';
  notes?: string;
  reductionAmount?: number;
};

export type BillProcessingLevel = 'Level 1: Coloring' | 'Level 2: Washing' | 'Level 3: Stitching';

export type BillStatus = 'Draft' | 'Pending Alampatti' | 'Pending Kappalur' | 'Pending Chairman' | 'Approved' | 'Returned' | 'Closed';

export type Bill = {
  id: string;
  invoiceNumber: string;
  vendor: Vendor;
  billDate: Date;
  amount: number;
  level: BillProcessingLevel;
  status: BillStatus;
  history: BillHistory[];
};
