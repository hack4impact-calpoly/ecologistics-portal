import { Schema, model, models } from "mongoose";

const ReimbursementSchema = new Schema({
  organization: {
    type: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    required: [true, "Organization is required"],
  },
  reportName: {
    type: String,
    required: [true, "Report Name is required"],
  },
  receiptName: {
    type: String,
    required: [true, "Recipient Name is required"],
  },
  receiptEmail: {
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
    reqired: [true, "Recipient Link is required"],
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
