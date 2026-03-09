import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api-helpers";
import { Schema, model, models } from "mongoose";

// Settings Schema - simple key-value store
const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", SettingsSchema);

const SETTINGS_KEY = "app_settings";

// GET /api/admin/settings - Get all settings
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    const settings = await Settings.findOne({ key: SETTINGS_KEY }).lean();
    return apiSuccess(settings?.value || null);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return apiError("SERVER_ERROR", "Failed to fetch settings", 500);
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await request.json();

    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { key: SETTINGS_KEY, value: body },
      { upsert: true, new: true }
    ).lean();

    return apiSuccess(settings?.value);
  } catch (error) {
    console.error("Error updating settings:", error);
    return apiError("SERVER_ERROR", "Failed to update settings", 500);
  }
}
