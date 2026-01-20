import { Schema, model, models } from "mongoose";

const WalletTransactionSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    type: {
      type: String,
      enum: ["credit", "debit", "refund", "cashback", "reward", "referral"],
      required: true,
    },
    amountPaise: { type: Number, required: true },
    description: { type: String },
    orderId: { type: String },
    balanceAfterPaise: { type: Number },
    idempotencyKey: { type: String, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const WalletTransaction =
  models.WalletTransaction || model("WalletTransaction", WalletTransactionSchema);
