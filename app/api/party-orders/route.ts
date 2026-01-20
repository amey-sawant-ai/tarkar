import { apiSuccess, apiError, requireAuth, getPagination } from "@/lib/api-helpers";
import connectToDatabase from "@/lib/mongodb";
import { PartyOrder } from "@/models";
import { NextResponse } from "next/server";

// GET /api/party-orders - List user's party orders
export async function GET(request: Request) {
  await connectToDatabase();

  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const { page, pageSize, skip } = getPagination(request);

  try {
    const query: Record<string, unknown> = { userId };
    if (status && status !== "all") {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      PartyOrder.find(query)
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PartyOrder.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return apiSuccess(
      orders.map((order) => ({
        id: order._id.toString(),
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
        placedAt: order.placedAt,
        createdAt: order.createdAt,
      })),
      { page, pageSize, total, totalPages }
    );
  } catch (error) {
    console.error("Error fetching party orders:", error);
    return apiError("FETCH_ERROR", "Failed to fetch party orders", 500);
  }
}

// POST /api/party-orders - Create a new party order
export async function POST(request: Request) {
  await connectToDatabase();

  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      eventDate,
      eventTime,
      guestCount,
      venue,
      specialRequests,
      packages,
    } = body;

    // Validate required fields
    if (
      !customerName ||
      !customerPhone ||
      !customerEmail ||
      !eventDate ||
      !eventTime ||
      !guestCount ||
      !venue ||
      !packages ||
      packages.length === 0
    ) {
      return apiError("VALIDATION_ERROR", "Missing required fields");
    }

    // Validate event date is in the future
    const eventDateObj = new Date(eventDate);
    if (eventDateObj < new Date()) {
      return apiError("VALIDATION_ERROR", "Event date must be in the future");
    }

    // Calculate billing
    const subTotalPaise = packages.reduce(
      (sum: number, pkg: { pricePaise: number; quantity: number }) =>
        sum + pkg.pricePaise * pkg.quantity,
      0
    );
    const taxPaise = Math.round(subTotalPaise * 0.05); // 5% tax
    const totalPaise = subTotalPaise + taxPaise;

    // Create party order
    const partyOrder = await PartyOrder.create({
      userId,
      status: "pending",
      customerName,
      customerPhone,
      customerEmail,
      eventDate: eventDateObj,
      eventTime,
      guestCount,
      venue,
      specialRequests: specialRequests || "",
      packages,
      billing: {
        subTotalPaise,
        taxPaise,
        deliveryFeePaise: 0, // No delivery fee for party orders
        discountPaise: 0,
        totalPaise,
      },
      timeline: [
        {
          status: "pending",
          label: "Order Placed",
          at: new Date(),
          completed: true,
        },
      ],
      placedAt: new Date(),
    });

    return apiSuccess(
      {
        id: partyOrder._id.toString(),
        status: partyOrder.status,
        eventDate: partyOrder.eventDate,
        eventTime: partyOrder.eventTime,
        billing: partyOrder.billing,
        placedAt: partyOrder.placedAt,
      }
    );
  } catch (error) {
    console.error("Error creating party order:", error);
    return apiError("CREATE_ERROR", "Failed to create party order", 500);
  }
}
