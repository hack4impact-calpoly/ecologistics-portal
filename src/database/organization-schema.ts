import { Schema, model, models, Types } from "mongoose";

interface Organization {
  name: string;
  description: string;
  website?: string;
  clerkUser: string;
  logo?: string;
  reimbursements: Types.ObjectId[];
  status: string;
  updates?: number;
}

const OrganizationSchema = new Schema({
  name: { type: String, required: [true, "Organization name is required."] },
  description: {
    type: String,
    required: [true, "Organization description is necessary."],
  },
  website: { type: String, required: false },
  clerkUser: {
    type: String,
    required: [true, "Organization clerk ID required."],
  },
  logo: { type: String, required: false },
  reimbursements: {
    type: [{ type: Schema.Types.ObjectId, ref: "Reimbursement" }],
    default: [],
    required: [
      true,
      "Reimbursements array allotted to this organization are required.",
    ],
  },
  status: {
    type: String,
    required: [true, "Organization status is required."],
  },
});

const Organization =
  models.Organization || model("Organization", OrganizationSchema);

export default Organization;
