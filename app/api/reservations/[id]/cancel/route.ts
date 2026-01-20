import connectToDatabase from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { apiSuccess, apiError, parseBody } from "@/lib/api-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/reservations/[id]/cancel - Cancel a reservation
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const body = await parseBody<{ reason?: string }>(request);
    
    // Find by ID or confirmation code
    const query = id.startsWith("TRK") 
      ? { confirmationCode: id }
      : { _id: id };
    
    const reservation = await Reservation.findOne(query);
    
    if (!reservation) {
      return apiError("NOT_FOUND", "Reservation not found", 404);
    }
    
    // Can only cancel pending or confirmed reservations
    if (!["pending", "confirmed"].includes(reservation.status)) {
      return apiError("BAD_REQUEST", "Cannot cancel this reservation", 400);
    }
    
    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    reservation.cancellationReason = body?.reason || "Cancelled by customer";
    
    await reservation.save();
    
    return apiSuccess({
      message: "Reservation cancelled successfully",
      reservation: reservation.toObject(),
    });
    
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return apiError("SERVER_ERROR", "Failed to cancel reservation", 500);
  }
}
