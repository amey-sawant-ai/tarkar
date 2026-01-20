import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order, User, Review } from "@/models";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api-helpers";

// GET /api/admin/reports - Get analytics data
export async function GET(request: NextRequest) {
  await connectToDatabase();

  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "7d";

  // Calculate date range
  const now = new Date();
  let startDate: Date;

  switch (range) {
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "7d":
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  try {
    // Get orders in date range
    const orders = await Order.find({
      createdAt: { $gte: startDate },
    }).lean();

    // Calculate summary
    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const totalRevenue = deliveredOrders.reduce(
      (sum, o) => sum + (o.billing?.totalPaise || 0),
      0
    );
    const totalOrders = orders.length;
    const averageOrderValue =
      deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

    // Get new users in date range
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get repeat customers (users with more than 1 order)
    const userOrderCounts = orders.reduce((acc, order) => {
      const id = order.userId?.toString();
      if (id) {
        acc[id] = (acc[id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const repeatCustomers = Object.values(userOrderCounts).filter(
      (count) => count > 1
    ).length;

    // Get average rating
    const reviews = await Review.find({
      createdAt: { $gte: startDate },
    }).lean();
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        : 0;

    // Revenue by day
    const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
    deliveredOrders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!revenueByDay[date]) {
        revenueByDay[date] = { revenue: 0, orders: 0 };
      }
      revenueByDay[date].revenue += order.billing?.totalPaise || 0;
      revenueByDay[date].orders += 1;
    });

    const revenueByDayArray = Object.entries(revenueByDay)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date));

    // Top dishes
    const dishStats: Record<string, { name: string; quantity: number; revenue: number }> = {};
    deliveredOrders.forEach((order) => {
      order.items?.forEach((item: { itemId: string; name: string; qty: number; pricePaise: number }) => {
        const id = item.itemId || item.name;
        if (!dishStats[id]) {
          dishStats[id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        dishStats[id].quantity += item.qty || 1;
        dishStats[id].revenue += (item.pricePaise || 0) * (item.qty || 1);
      });
    });

    const topDishes = Object.values(dishStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Orders by status
    const statusCounts: Record<string, number> = {};
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const ordersByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Revenue by category (simplified - using item names as proxy)
    const categoryRevenue: Record<string, number> = {};
    deliveredOrders.forEach((order) => {
      order.items?.forEach((item: { category?: string; pricePaise: number; qty: number }) => {
        const category = item.category || "Other";
        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + (item.pricePaise || 0) * (item.qty || 1);
      });
    });

    const revenueByCategory = Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return apiSuccess({
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        newUsers,
        repeatCustomers,
        averageRating,
      },
      revenueByDay: revenueByDayArray,
      topDishes,
      ordersByStatus,
      revenueByCategory,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return apiError("Failed to fetch reports", 500);
  }
}
