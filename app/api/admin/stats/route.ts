import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdmin, apiSuccess, apiError } from "@/lib/api-helpers";
import { NextResponse } from "next/server";
import { Order, User, Dish } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check admin authorization
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate stats in parallel
    const [
      totalOrders,
      todayOrders,
      revenueStats,
      todayRevenueStats,
      totalUsers,
      newUsersToday,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalDishes,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments(),
      
      // Today's orders
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      
      // Total revenue (delivered orders only)
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$billing.totalPaise" } } },
      ]),
      
      // Today's revenue
      Order.aggregate([
        { 
          $match: { 
            status: "delivered",
            createdAt: { $gte: today, $lt: tomorrow } 
          } 
        },
        { $group: { _id: null, total: { $sum: "$billing.totalPaise" } } },
      ]),
      
      // Total users
      User.countDocuments({ role: "user" }),
      
      // New users today
      User.countDocuments({ 
        role: "user",
        createdAt: { $gte: today, $lt: tomorrow } 
      }),
      
      // Active orders (not delivered or cancelled)
      Order.countDocuments({ 
        status: { $nin: ["delivered", "cancelled"] } 
      }),
      
      // Completed orders
      Order.countDocuments({ status: "delivered" }),
      
      // Cancelled orders
      Order.countDocuments({ status: "cancelled" }),
      
      // Total dishes
      Dish.countDocuments(),
    ]);

    const stats = {
      totalOrders,
      todayOrders,
      totalRevenuePaise: revenueStats[0]?.total || 0,
      todayRevenuePaise: todayRevenueStats[0]?.total || 0,
      totalUsers,
      newUsersToday,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalDishes,
    };

    return apiSuccess(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return apiError("SERVER_ERROR", "Failed to fetch admin stats", 500);
  }
}
