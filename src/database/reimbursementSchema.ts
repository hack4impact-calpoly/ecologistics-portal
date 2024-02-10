import { Schema, model, models } from "mongoose";

const ReimbursementSchema = new Schema({
  //NOTE: I had to pass the organization as a string instead of an objectID because JSON cant handle that type.
  //we can pass the string part of the objectID when we post, and anytime we need to parse with the ID,
  //we can do something along the lines of col.find({_id: new ObjectId(organization)}).toArray(function(err,results){});
  organization: {
    type: String,
    required: [true, "Organization is required"],
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
