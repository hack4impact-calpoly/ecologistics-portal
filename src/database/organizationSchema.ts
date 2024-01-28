import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    website:{
        type: String,
        required: [true, 'Website is required'],
    },
    clerkUser:{
        type: String,
        required: [true, 'Clerk User is required'],
    },
    logo:{
        type: String,
        required: [true, 'Logo is required'],
    },
    reimbursement:{
        type: [{ type: Schema.Types.ObjectId}],
        required: [true, 'Reimbursement is required'],
    },
});

const Organization = models.Organization || model("Organization", OrganizationSchema);

export default Organization;