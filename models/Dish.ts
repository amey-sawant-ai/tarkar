import { Schema, model, models, Types } from "mongoose";

const NutritionSchema = new Schema(
  {
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    fiber: { type: Number },
  },
  { _id: false }
);

const DishSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    shortDescription: { type: String },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true, index: true },
    
    // Pricing (in paise - 1 INR = 100 paise)
    pricePaise: { type: Number, required: true },
    discountPricePaise: { type: Number },
    
    // Media
    imageUrl: { type: String },
    thumbnailUrl: { type: String },
    gallery: [{ type: String }],
    
    // Attributes
    isVeg: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    spicyLevel: { type: Number, min: 0, max: 5, default: 0 },
    
    // Serving info
    servingSize: { type: String },
    preparationTime: { type: Number }, // in minutes
    
    // Nutrition info
    nutrition: { type: NutritionSchema },
    
    // Ingredients & allergens
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    
    // Status
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    
    // Ratings
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    
    // Ordering
    displayOrder: { type: Number, default: 0 },
    
    // Tags for search
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Text search index
DishSchema.index({ name: "text", description: "text", tags: "text" });

export const Dish = models.Dish || model("Dish", DishSchema);
