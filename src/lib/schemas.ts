import { z } from 'zod';

export const billSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required.'),
  level: z.enum(['Level 1: Coloring', 'Level 2: Washing', 'Level 3: Stitching']),
  invoiceNumber: z.string().min(1, 'Invoice number is required.'),
  billDate: z.date({ required_error: 'Bill date is required.' }),
  amount: z.coerce.number().positive('Amount must be positive.'),
});
