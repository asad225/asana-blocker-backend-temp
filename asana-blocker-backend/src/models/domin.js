import mongoose from "mongoose";

const domainSchema = new mongoose.Schema(
  {
    domain: {
      productive_sites: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
          sites: { type: String, required: true, default: "none" },
          method: { type: String, required: true, default: "none" },
        },
      ],
      block_sites: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
          sites: { type: String, required: true, default: "none" },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Domains =
  mongoose.models.domains || mongoose.model("domain", domainSchema);
