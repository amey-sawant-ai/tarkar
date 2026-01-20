import connectToDatabase from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { 
  apiSuccess, apiError, getOptionalUserId, parseBody, 
  validateRequired, getPagination, paginatedResponse 
} from "@/lib/api-helpers";

// GET /api/reservations - Get user's reservations
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const userId = getOptionalUserId(request);
    
    if (!userId) {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }
    
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPagination(request);
    
    const status = searchParams.get("status");
    const query: Record<string, unknown> = { userId };
    
    if (status) {
      query.status = status;
    }
    
    const [total, reservations] = await Promise.all([
      Reservation.countDocuments(query),
      Reservation.find(query)
        .sort({ date: -1, time: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);
    
    return paginatedResponse(reservations, total, page, pageSize);
    
  } catch (error) {
    console.error("Get reservations error:", error);
    return apiError("SERVER_ERROR", "Failed to get reservations", 500);
  }
}

// POST /api/reservations - Create new reservation
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const userId = getOptionalUserId(request);
    
    const body = await parseBody<{
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      date: string;
      time: string;
      partySize: number;
      tablePreference?: "indoor" | "outdoor" | "private" | "bar" | "any";
      specialRequests?: string;
      occasion?: "birthday" | "anniversary" | "business" | "date" | "family" | "other" | "none";
    }>(request);
    
    const validation = validateRequired(body, [
      "guestName", "guestEmail", "guestPhone", "date", "time", "partySize"
    ]);
    
    if (!validation.valid) {
      return apiError("VALIDATION_ERROR", "Validation failed", 400, validation.errors);
    }
    
    const { date, time, partySize, ...rest } = validation.data;
    
    // Validate date is in the future
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (reservationDate < today) {
      return apiError("VALIDATION_ERROR", "Reservation date must be in the future", 400);
    }
    
    // Validate party size
    if (partySize < 1 || partySize > 50) {
      return apiError("VALIDATION_ERROR", "Party size must be between 1 and 50", 400);
    }
    
    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return apiError("VALIDATION_ERROR", "Invalid time format. Use HH:MM", 400);
    }
    
    // Check for conflicting reservations (simple check)
    const existingCount = await Reservation.countDocuments({
      date: reservationDate,
      time,
      status: { $in: ["pending", "confirmed"] },
    });
    
    // Simple capacity check - max 10 reservations per time slot
    if (existingCount >= 10) {
      return apiError("CONFLICT", "No availability for this time slot", 409);
    }
    
    const reservation = await Reservation.create({
      userId: userId || undefined,
      date: reservationDate,
      time,
      partySize,
      status: "pending",
      ...rest,
    });
    
    return apiSuccess({
      reservation,
      confirmationCode: reservation.confirmationCode,
      message: "Reservation created successfully. You will receive a confirmation shortly.",
    }, undefined, 201);
    
  } catch (error) {
    console.error("Create reservation error:", error);
    return apiError("SERVER_ERROR", "Failed to create reservation", 500);
  }
}
