import { apiSuccess, apiError, requireAdmin } from "@/lib/api-helpers";
import connectToDatabase from "@/lib/mongodb";
import { PartyOrder } from "@/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET /api/admin/party-orders/[id] - Get a specific party order (admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiError("Invalid party order ID", 400);
  }

  try {
    const order = await PartyOrder.findById(id).lean();

    if (!order) {
      return apiError("Party order not found", 404);
    }

    return apiSuccess({
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
      cancelledAt: order.cancelledAt,
      cancellationReason: order.cancellationReason,
      placedAt: order.placedAt,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error fetching party order:", error);
    return apiError("Failed to fetch party order", 500);
  }
}

// PATCH /api/admin/party-orders/[id] - Update party order status or notes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiError("Invalid party order ID", 400);
  }

  try {
    const order = await PartyOrder.findById(id);

    if (!order) {
      return apiError("Party order not found", 404);
    }

    const body = await request.json();
    const { status, adminNotes } = body;

    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    if (status && status !== order.status) {
      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["preparing", "cancelled"],
        preparing: ["ready", "cancelled"],
        ready: ["delivered", "cancelled"],
        delivered: [],
        cancelled: [],
      };

      if (!validTransitions[order.status]?.includes(status)) {
        return apiError(
          `Invalid status transition from ${order.status} to ${status}`,
          400
        );
      }

      order.status = status;
      
      const statusLabels: Record<string, string> = {
        confirmed: "Order Confirmed",
        preparing: "Preparation Started",
        ready: "Order Ready",
        delivered: "Order Delivered",
        cancelled: "Order Cancelled",
      };

      order.timeline.push({
        status,
        label: statusLabels[status] || status,
        at: new Date(),
        completed: true,
      });

      if (status === "cancelled") {
        order.cancelledAt = new Date();
        order.cancellationReason = body.cancellationReason || "Cancelled by admin";
      }
    }

    await order.save();

    return apiSuccess({
      id: order._id.toString(),
      status: order.status,
      timeline: order.timeline,
      message: "Party order updated successfully",
    });
  } catch (error) {
    console.error("Error updating party order:", error);
    return apiError("Failed to update party order", 500);
  }
}
