import { Schema, model, models } from "mongoose";

const organizationSchema = new Schema({
  name: { type: String, required: [true, "Organization name is required."] },
  description: {
    type: String,
    required: [true, "Organization description is necessary."],
  },
  website: { type: String, required: false },
  clerkUser: {
    type: String,
    required: [true, "Organization clerk username required."],
  },
  logo: { type: String, required: false },
  reimbursements: {
    type: [Schema.Types.ObjectId],
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
