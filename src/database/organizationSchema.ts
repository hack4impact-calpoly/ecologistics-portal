import { Schema, model, models } from "mongoose";

interface Organization {
  name: string;
  description: string;
  website?: string;
  clerkUser: string;
  logo?: string;
  reimbursements: Schema.Types.ObjectId[];
  status: string;
}

interface GetOrganizationResponse extends Organization {}
interface GetOrganizationListResponse {
  organizations: Organization[];
}
interface UpdateOrganizationResponse extends Organization {}
interface DeleteOrganizationResponse {
  message: string;
  status: number;
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
