import { Schema, model, models, Types } from "mongoose";
import { Alert } from "@/models/alert";

const AlertSchema = new Schema<Alert>({
  userId: { type: String, required: [true, "UserId (Clerk Id) is required."] },
  title: { type: String, required: [true, "Title is required"] },
  description: {
    type: String,
    required: [true, "Description is necessary."],
  },
  date: { type: Date, required: true, default: Date.now },
});

const AlertModel = models.Alert || model("Alert", AlertSchema);

export default AlertModel;
