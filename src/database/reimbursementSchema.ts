import { Schema, model, models } from "mongoose";

const ReimbursementSchema = new Schema({
    organization: {
        type: Schema.Types.ObjectId,
        required: true
    },
    reportName: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientEmail: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    receiptLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});
const Reimbursement = models.Reimbursement || model("Reimbursement", ReimbursementSchema);

export default Reimbursement;