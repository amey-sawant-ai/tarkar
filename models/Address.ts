import { Schema, model, models } from "mongoose";

const AddressSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    
    // Address details
    label: { type: String, required: true }, // "Home", "Work", etc.
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Address components
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    
    // Delivery instructions
    deliveryInstructions: { type: String },
    
    // Location coordinates (for delivery)
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    
    // Status
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Address = models.Address || model("Address", AddressSchema);
