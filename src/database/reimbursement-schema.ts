import { Schema, model, models, Types } from "mongoose";

interface Reimbursement {
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

const ReimbursementSchema = new Schema({
  clerkUserId: {
    type: String,
    required: [true, "Clerk User Id is required"],
  },
  reportName: {
    type: String,
    required: [true, "Report Name is required"],
  },
  recipientName: {
    type: String,
    required: [true, "Recipient Name is required"],
  },
  recipientEmail: {
    type: String,
    required: [true, "Recipient Email is required"],
  },
  transactionDate: {
    type: Date,
    required: [true, "Transaction Date is required"],
  },
  amount: {
    type: Number,
    required: [true, "Transaction Amount is required"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment Method is required"],
  },
  purpose: {
    type: String,
    required: [true, "Purpose is required"],
  },
  receiptLink: {
    type: String,
    reqired: [true, "Receipt Link is required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
  },
  comment: {
    type: String,
    required: [false, "Comment is not required"],
  },
});

const Reimbursement =
  models.Reimbursement || model("Reimbursement", ReimbursementSchema);

export default Reimbursement;
