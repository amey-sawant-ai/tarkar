import { Schema, model, models } from "mongoose";

const PartyOrderItemSchema = new Schema(
  {
    packageId: { type: Number, required: true },
    packageName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePaise: { type: Number, required: true },
    servings: { type: String, required: true },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks", "dessert"],
      required: true,
    },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const TimelineStepSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      required: true,
    },
    label: { type: String, required: true },
    at: { type: Date, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const BillingSchema = new Schema(
  {
    subTotalPaise: { type: Number, required: true },
    taxPaise: { type: Number, default: 0 },
    deliveryFeePaise: { type: Number, default: 0 },
    discountPaise: { type: Number, default: 0 },
    totalPaise: { type: Number, required: true },
  },
  { _id: false }
);

const PartyOrderSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    // Customer details
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    // Event details
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    guestCount: { type: Number, required: true },
    venue: { type: String, required: true },
    specialRequests: { type: String, default: "" },
    // Order details
    packages: { type: [PartyOrderItemSchema], default: [] },
    billing: { type: BillingSchema, required: true },
    timeline: { type: [TimelineStepSchema], default: [] },
    // Admin notes
    adminNotes: { type: String, default: "" },
    // Cancellation
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    // Timestamps
    placedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

// Index for efficient queries
PartyOrderSchema.index({ eventDate: 1, status: 1 });

export const PartyOrder =
  models.PartyOrder || model("PartyOrder", PartyOrderSchema);
