import mongoose, { InferSchemaType, Model } from "mongoose";

const riskSchema = new mongoose.Schema(
  {
    clause: String,
    level: { type: String, enum: ["high", "medium", "low"] },
    issue: String,
    suggestion: String,
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileSize: Number,
    fileType: String,
    blobUrl: { type: String, required: true },
    result: {
      summary: String,
      riskLevel: { type: String, enum: ["high", "medium", "low"] },
      risks: [riskSchema],
      missingClauses: [String],
    },
  },
  { timestamps: true },
);

export type ReviewDoc = InferSchemaType<typeof reviewSchema>;

export const Review: Model<ReviewDoc> =
  (mongoose.models.Review as Model<ReviewDoc>) ?? mongoose.model<ReviewDoc>("Review", reviewSchema);
