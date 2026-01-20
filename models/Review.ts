import { Schema, model, models, Types } from "mongoose";

const ReviewSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userAvatarUrl: { type: String },
    
    // What's being reviewed
    dishId: { type: Types.ObjectId, ref: "Dish", index: true },
    orderId: { type: String, index: true },
    
    // Review content
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String },
    
    // Photos
    photos: [{ type: String }],
    
    // Verified purchase
    isVerified: { type: Boolean, default: false },
    
    // Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "pending",
      index: true,
    },
    moderatedAt: { type: Date },
    moderationNote: { type: String },
    
    // Helpful votes
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    
    // Restaurant response
    response: {
      text: { type: String },
      respondedAt: { type: Date },
      respondedBy: { type: String },
    },
  },
  { timestamps: true }
);

// Compound index for dish reviews
ReviewSchema.index({ dishId: 1, status: 1, createdAt: -1 });

export const Review = models.Review || model("Review", ReviewSchema);
