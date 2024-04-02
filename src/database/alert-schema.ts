import { Schema, model, models, Types } from "mongoose";

interface Alert {
  userId: String; // cleark id
  title: String; // request was approved / denied
  description: String;
  date: Date; // date.now default when making schema
}

const AlertSchema = new Schema({
  userId: { type: String, required: [true, "UserId (Clerk Id) is required."] },
  title: { type: String, required: [true, "Title is required"] },
  description: {
    type: String,
    required: [true, "Description is necessary."],
  },
  date: { type: Date, required: true, default: Date.now },
});

const Alert = models.Alert || model("Alert", AlertSchema);

export default Alert;
