import { Schema, model, models, Types } from "mongoose";
import { Reimbursement } from "@/models/reimbursement";

const ReimbursementSchema = new Schema<Reimbursement>({
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

const ReimbursementModel =
  models.Reimbursement || model("Reimbursement", ReimbursementSchema);

export default ReimbursementModel;
