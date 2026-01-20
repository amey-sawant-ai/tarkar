import { Schema, model, models } from "mongoose";

const PaymentMethodSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    type: { type: String, enum: ["card", "upi", "netbanking", "wallet"], required: true },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    lastUsedAt: { type: Date },
    cardNumberMasked: { type: String },
    expiry: { type: String },
    cardType: { type: String, enum: ["visa", "mastercard", "rupay", "amex"] },
    upiId: { type: String },
    bankName: { type: String },
  },
  { timestamps: true }
);

export const PaymentMethod = models.PaymentMethod || model("PaymentMethod", PaymentMethodSchema);
