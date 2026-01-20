import { Schema, model, models, Types } from "mongoose";

const ReservationSchema = new Schema(
  {
    userId: { type: String, index: true },
    
    // Guest info (for non-logged in users)
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    
    // Reservation details
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true }, // "19:00" format
    partySize: { type: Number, required: true, min: 1, max: 50 },
    
    // Table preference
    tablePreference: { 
      type: String, 
      enum: ["indoor", "outdoor", "private", "bar", "any"],
      default: "any"
    },
    
    // Special requests
    specialRequests: { type: String },
    occasion: { 
      type: String,
      enum: ["birthday", "anniversary", "business", "date", "family", "other", "none"],
      default: "none"
    },
    
    // Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
      index: true,
    },
    
    // Confirmation
    confirmationCode: { type: String, unique: true, index: true },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    
    // Pre-order (optional)
    preOrderItems: [{
      dishId: { type: Types.ObjectId, ref: "Dish" },
      name: { type: String },
      qty: { type: Number },
      pricePaise: { type: Number },
    }],
    preOrderTotalPaise: { type: Number, default: 0 },
    
    // Reminder sent
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate confirmation code before save
ReservationSchema.pre("save", function () {
  if (!this.confirmationCode) {
    this.confirmationCode = `TRK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
});

export const Reservation = models.Reservation || model("Reservation", ReservationSchema);
