import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdmin, apiSuccess, apiError, getPagination } from "@/lib/api-helpers";
import { NextResponse } from "next/server";
import { Order, User } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check admin authorization
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(req.url);
    const { page, pageSize, skip } = getPagination(req);
    
    // Filters
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build query
    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      if (status === "active") {
        query.status = { $nin: ["delivered", "cancelled"] };
      } else {
        query.status = status;
      }
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        (query.createdAt as Record<string, Date>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        (query.createdAt as Record<string, Date>).$lt = endDate;
      }
    }

    // If search, find matching user IDs first
    let userIds: string[] | null = null;
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id").lean();
      userIds = users.map((u) => u._id.toString());
      
      // Also search by order ID
      query.$or = [
        { userId: { $in: userIds } },
        { _id: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders with user info
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Fetch user details for each order
    const orderUserIds = [...new Set(orders.map((o) => o.userId))];
    const users = await User.find({ _id: { $in: orderUserIds } })
      .select("name email phone")
      .lean();
    
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Enrich orders with user data
    const enrichedOrders = orders.map((order) => ({
      ...order,
      user: userMap.get(order.userId) || null,
    }));

    return apiSuccess(enrichedOrders, {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    return apiError("SERVER_ERROR", "Failed to fetch orders", 500);
  }
}
