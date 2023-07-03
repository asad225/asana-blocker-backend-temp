import mongoose from "mongoose";

const MethodSchema = new mongoose.Schema({
  method: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});
export const Method = mongoose.model("Method", MethodSchema);

const TextSchema = new mongoose.Schema({
  len: {
    type: String,
  },
  onoff: {
    type: Boolean,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});
export const Text = mongoose.model("Text", TextSchema);

const CheckIntervalSchema = new mongoose.Schema({
  TaskCheckInterval: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});
export const CheckInterval = mongoose.model(
  "CheckInterval",
  CheckIntervalSchema
);


