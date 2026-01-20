import { Schema, model, models } from "mongoose";

const NotificationsPrefsSchema = new Schema(
  {
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    sms: { type: Boolean, default: true },
  },
  { _id: false }
);

const PreferencesSchema = new Schema(
  {
    darkMode: { type: Boolean, default: false },
    language: { type: String, enum: ["en", "hi", "mr"], default: "en" },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    email: { type: String, index: true, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    phone: { type: String },
    avatarUrl: { type: String },
    role: { 
      type: String, 
      enum: ["user", "admin", "staff"], 
      default: "user",
      index: true 
    },
    isActive: { type: Boolean, default: true },
    walletBalancePaise: { type: Number, default: 0 },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    notifications: { type: NotificationsPrefsSchema, default: () => ({}) },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export type UserDocument = typeof UserSchema extends infer T ? any : any;

export const User = models.User || model("User", UserSchema);
