import connectToDatabase from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { apiSuccess, apiError, getOptionalUserId, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/reservations/[id] - Get single reservation
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const userId = getOptionalUserId(request);
    
    // Find by ID or confirmation code
    const query = id.startsWith("TRK") 
      ? { confirmationCode: id }
      : { _id: id };
    
    // If user is logged in, ensure they own the reservation
    if (userId) {
      Object.assign(query, { userId });
    }
    
    const reservation = await Reservation.findOne(query).lean();
    
    if (!reservation) {
      return apiError("NOT_FOUND", "Reservation not found", 404);
    }
    
    return apiSuccess(reservation);
    
  } catch (error) {
    console.error("Get reservation error:", error);
    return apiError("SERVER_ERROR", "Failed to get reservation", 500);
  }
}

// PUT /api/reservations/[id] - Update reservation
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const body = await parseBody<{
      date?: string;
      time?: string;
      partySize?: number;
      tablePreference?: string;
      specialRequests?: string;
    }>(request);
    
    if (!body) {
      return apiError("BAD_REQUEST", "Request body is required", 400);
    }
    
    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return apiError("NOT_FOUND", "Reservation not found", 404);
    }
    
    // Can only update pending or confirmed reservations
    if (!["pending", "confirmed"].includes(reservation.status)) {
      return apiError("BAD_REQUEST", "Cannot modify this reservation", 400);
    }
    
    // Update fields
    if (body.date) reservation.date = new Date(body.date);
    if (body.time) reservation.time = body.time;
    if (body.partySize) reservation.partySize = body.partySize;
    if (body.tablePreference) reservation.tablePreference = body.tablePreference;
    if (body.specialRequests !== undefined) reservation.specialRequests = body.specialRequests;
    
    await reservation.save();
    
    return apiSuccess(reservation.toObject());
    
  } catch (error) {
    console.error("Update reservation error:", error);
    return apiError("SERVER_ERROR", "Failed to update reservation", 500);
  }
}
