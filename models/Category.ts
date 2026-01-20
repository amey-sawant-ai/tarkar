import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    imageUrl: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = models.Category || model("Category", CategorySchema);
