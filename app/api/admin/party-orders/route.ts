import {
  apiSuccess,
  apiError,
  requireAdmin,
  getPagination,
} from "@/lib/api-helpers";
import connectToDatabase from "@/lib/mongodb";
import { PartyOrder } from "@/models";
import { NextResponse } from "next/server";

// GET /api/admin/party-orders - List all party orders (admin only)
export async function GET(request: Request) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const { page, pageSize, skip } = getPagination(request);

  try {
    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      query.eventDate = {};
      if (dateFrom) {
        (query.eventDate as Record<string, Date>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        (query.eventDate as Record<string, Date>).$lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      PartyOrder.find(query)
        .sort({ eventDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PartyOrder.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return apiSuccess(
      orders.map((order) => ({
        id: order._id.toString(),
        userId: order.userId,
        status: order.status,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        eventDate: order.eventDate,
        eventTime: order.eventTime,
        guestCount: order.guestCount,
        venue: order.venue,
        specialRequests: order.specialRequests,
        packages: order.packages,
        billing: order.billing,
        timeline: order.timeline,
        adminNotes: order.adminNotes,
        placedAt: order.placedAt,
        createdAt: order.createdAt,
      })),
      { page, pageSize, total, totalPages }
    );
  } catch (error) {
    console.error("Error fetching party orders:", error);
    return apiError("SERVER_ERROR", "Failed to fetch party orders", 500);
  }
}
