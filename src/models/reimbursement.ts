export interface Reimbursement {
  clerkUserId: string;
  reportName: string;
  recipientName: string;
  recipientEmail: string;
  transactionDate: Date;
  amount: number;
  paymentMethod: string;
  purpose: string;
  receiptLink: string;
  status: string;
  comment?: string;
}
