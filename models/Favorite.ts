import { Schema, model, models } from "mongoose";

const FavoriteSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    dishId: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
    orderCount: { type: Number, default: 0 },
    lastOrderedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Ensure unique combination of userId and dishId
FavoriteSchema.index({ userId: 1, dishId: 1 }, { unique: true });

export const Favorite = models.Favorite || model("Favorite", FavoriteSchema);
