import { apiSuccess, apiError, requireAuth } from "@/lib/api-helpers";
import connectToDatabase from "@/lib/mongodb";
import { PartyOrder } from "@/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET /api/party-orders/[id] - Get a specific party order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiError("INVALID_ID", "Invalid party order ID");
  }

  try {
    const order = await PartyOrder.findOne({ _id: id, userId }).lean();

    if (!order) {
      return apiError("NOT_FOUND", "Party order not found", 404);
    }

    return apiSuccess({
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
      adminNotes: order.adminNotes,
      cancelledAt: order.cancelledAt,
      cancellationReason: order.cancellationReason,
      placedAt: order.placedAt,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error fetching party order:", error);
    return apiError("FETCH_ERROR", "Failed to fetch party order", 500);
  }
}

// PATCH /api/party-orders/[id] - Update a party order (only before confirmation)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiError("INVALID_ID", "Invalid party order ID");
  }

  try {
    const order = await PartyOrder.findOne({ _id: id, userId });

    if (!order) {
      return apiError("NOT_FOUND", "Party order not found", 404);
    }

    // Only allow updates if order is still pending
    if (order.status !== "pending") {
      return apiError(
        "FORBIDDEN",
        "Cannot modify order after it has been confirmed"
      );
    }

    const body = await request.json();
    const allowedUpdates = [
      "customerName",
      "customerPhone",
      "customerEmail",
      "eventDate",
      "eventTime",
      "guestCount",
      "venue",
      "specialRequests",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.eventDate) {
      updates.eventDate = new Date(updates.eventDate as string);
    }

    const updatedOrder = await PartyOrder.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).lean();

    return apiSuccess({
      id: updatedOrder!._id.toString(),
      status: updatedOrder!.status,
      message: "Party order updated successfully",
    });
  } catch (error) {
    console.error("Error updating party order:", error);
    return apiError("UPDATE_ERROR", "Failed to update party order", 500);
  }
}

// DELETE /api/party-orders/[id] - Cancel a party order (only if pending)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiError("INVALID_ID", "Invalid party order ID");
  }

  try {
    const order = await PartyOrder.findOne({ _id: id, userId });

    if (!order) {
      return apiError("NOT_FOUND", "Party order not found", 404);
    }

    // Only allow cancellation if order is pending
    if (order.status !== "pending") {
      return apiError(
        "FORBIDDEN",
        "Cannot cancel order after it has been confirmed. Please contact support."
      );
    }

    // Update status to cancelled
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = "Cancelled by user";
    order.timeline.push({
      status: "cancelled",
      label: "Order Cancelled",
      at: new Date(),
      completed: true,
    });

    await order.save();

    return apiSuccess({
      id: order._id.toString(),
      status: "cancelled",
      message: "Party order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling party order:", error);
    return apiError("CANCEL_ERROR", "Failed to cancel party order", 500);
  }
}
