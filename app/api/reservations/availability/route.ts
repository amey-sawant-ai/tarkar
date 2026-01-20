import connectToDatabase from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// GET /api/reservations/availability - Check availability for a date
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const partySizeStr = searchParams.get("partySize");
    
    if (!dateStr) {
      return apiError("BAD_REQUEST", "Date is required", 400);
    }
    
    const date = new Date(dateStr);
    const partySize = parseInt(partySizeStr || "2", 10);
    
    // Define available time slots (restaurant hours)
    const timeSlots = [
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
    ];
    
    // Get existing reservations for the date
    const existingReservations = await Reservation.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999)),
          },
          status: { $in: ["pending", "confirmed"] },
        },
      },
      {
        $group: {
          _id: "$time",
          count: { $sum: 1 },
          totalGuests: { $sum: "$partySize" },
        },
      },
    ]);
    
    // Calculate availability for each slot
    const maxReservationsPerSlot = 10;
    const maxGuestsPerSlot = 50;
    
    const availability = timeSlots.map((time) => {
      const existing = existingReservations.find((r) => r._id === time);
      const reservationCount = existing?.count || 0;
      const guestCount = existing?.totalGuests || 0;
      
      const available = 
        reservationCount < maxReservationsPerSlot && 
        (guestCount + partySize) <= maxGuestsPerSlot;
      
      return {
        time,
        available,
        remainingSlots: Math.max(0, maxReservationsPerSlot - reservationCount),
      };
    });
    
    return apiSuccess({
      date: dateStr,
      partySize,
      slots: availability,
    });
    
  } catch (error) {
    console.error("Check availability error:", error);
    return apiError("SERVER_ERROR", "Failed to check availability", 500);
  }
}
