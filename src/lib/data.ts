
import type { Vendor, Bill, UserDefinition } from '@/types';
import { subDays } from 'date-fns';

export const vendors: Vendor[] = [
  { id: 'vendor-1', name: 'Supreme Dyes Inc.' },
  { id: 'vendor-2', name: 'Aqua Washers Ltd.' },
  { id: 'vendor-3', name: 'Perfect Stitches Co.' },
  { id: 'vendor-4', name: 'Rainbow Colors' },
  { id: 'vendor-5', name: 'Fabric Finishers' },
];

export const users: UserDefinition[] = [
    { id: 'user-1', name: 'Alampatti AM', role: 'Accounts Manager (Alampatti)', email: 'alampatti@tmills.com', password: 'password123' },
    { id: 'user-2', name: 'Kappalur AM', role: 'Accounts Manager (Kappalur)', email: 'kappalur@tmills.com', password: 'password123' },
    { id: 'user-3', name: 'Mr. Chairman', role: 'Chairman', email: 'chairman@tmills.com', password: 'password123' },
];

export const bills: Bill[] = [
  {
    id: 'BILL-001',
    invoiceNumber: 'INV-2024-A1',
    vendor: vendors[0],
    billDate: subDays(new Date(), 5),
    amount: 75000,
    level: 'Level 1: Coloring',
    status: 'Pending Kappalur',
    history: [
      { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 5) },
      { action: 'Approved', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 4) },
    ],
  },
  {
    id: 'BILL-002',
    invoiceNumber: 'INV-2024-B2',
    vendor: vendors[1],
    billDate: subDays(new Date(), 12),
    amount: 120000,
    level: 'Level 2: Washing',
    status: 'Pending Chairman',
    history: [
      { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 12) },
      { action: 'Approved', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 11) },
      { action: 'Approved', actor: 'Accounts Manager (Kappalur)', timestamp: subDays(new Date(), 10) },
    ],
  },
  {
    id: 'BILL-003',
    invoiceNumber: 'INV-2024-C3',
    vendor: vendors[2],
    billDate: subDays(new Date(), 25),
    amount: 45000,
    level: 'Level 3: Stitching',
    status: 'Returned',
    history: [
      { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 25) },
      { action: 'Returned', actor: 'Accounts Manager (Kappalur)', notes: 'Incorrect quantity listed', timestamp: subDays(new Date(), 22) },
    ],
  },
  {
    id: 'BILL-004',
    invoiceNumber: 'INV-2024-D4',
    vendor: vendors[3],
    billDate: subDays(new Date(), 2),
    amount: 95000,
    level: 'Level 1: Coloring',
    status: 'Pending Alampatti',
    history: [{ action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 2) }],
  },
  {
    id: 'BILL-005',
    invoiceNumber: 'INV-2024-E5',
    vendor: vendors[4],
    billDate: subDays(new Date(), 35),
    amount: 210000,
    level: 'Level 2: Washing',
    status: 'Closed',
    history: [
      { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 35) },
      { action: 'Approved', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 34) },
      { action: 'Approved', actor: 'Accounts Manager (Kappalur)', timestamp: subDays(new Date(), 33) },
      { action: 'Approved', actor: 'Chairman', timestamp: subDays(new Date(), 30) },
      { action: 'Closed', actor: 'System', timestamp: subDays(new Date(), 28) },
    ],
  },
  {
    id: 'BILL-006',
    invoiceNumber: 'INV-2024-F6',
    vendor: vendors[0],
    billDate: subDays(new Date(), 8),
    amount: 62000,
    level: 'Level 1: Coloring',
    status: 'Pending Kappalur',
    history: [
      { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 8) },
      { action: 'Approved', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 7) },
    ],
  },
   {
    id: 'BILL-007',
    invoiceNumber: 'INV-2024-G7',
    vendor: vendors[2],
    billDate: subDays(new Date(), 18),
    amount: 88000,
    level: 'Level 3: Stitching',
    status: 'Approved',
    history: [
      { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 18) },
      { action: 'Approved', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 17) },
      { action: 'Approved', actor: 'Accounts Manager (Kappalur)', timestamp: subDays(new Date(), 15) },
      { action: 'Approved', actor: 'Chairman', timestamp: subDays(new Date(), 14) },
    ],
  },
  {
    id: 'BILL-008',
    invoiceNumber: 'INV-2024-H8',
    vendor: vendors[1],
    billDate: subDays(new Date(), 40),
    amount: 150000,
    level: 'Level 2: Washing',
    status: 'Closed',
    history: [
        { action: 'Created', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 40) },
        { action: 'Approved', actor: 'Accounts Manager (Alampatti)', timestamp: subDays(new Date(), 39) },
        { action: 'Approved', actor: 'Accounts Manager (Kappalur)', timestamp: subDays(new Date(), 38) },
        { action: 'Approved', actor: 'Chairman', timestamp: subDays(new Date(), 35) },
        { action: 'Closed', actor: 'System', timestamp: subDays(new Date(), 32) },
    ],
  },
];
