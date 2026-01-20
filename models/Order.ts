import { Schema, model, models, Types } from "mongoose";

const OrderItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    pricePaise: { type: Number, required: true },
  },
  { _id: false }
);

const TimelineStepSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "order-placed",
        "confirmed",
        "preparing",
        "ready",
        "out-for-delivery",
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

const DeliverySchema = new Schema(
  {
    name: String,
    phone: String,
    vehicleNumber: String,
  },
  { _id: false }
);

const BillingSchema = new Schema(
  {
    subTotalPaise: Number,
    taxPaise: Number,
    deliveryFeePaise: Number,
    discountPaise: Number,
    totalPaise: Number,
    paymentMethod: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    status: {
      type: String,
      enum: [
        "order-placed",
        "confirmed",
        "preparing",
        "ready",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "order-placed",
    },
    items: { type: [OrderItemSchema], default: [] },
    timeline: { type: [TimelineStepSchema], default: [] },
    address: { type: String },
    deliveryType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },
    delivery: { type: DeliverySchema },
    billing: { type: BillingSchema, required: true },
    placedAt: { type: Date, default: () => new Date() },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
