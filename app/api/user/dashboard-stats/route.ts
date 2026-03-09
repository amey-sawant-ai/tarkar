import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getUserId, apiSuccess, apiError } from "@/lib/api-helpers";

// GET /api/user/dashboard-stats - Get user dashboard statistics
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserId(req);
    if (!userId) {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }

    // Get order statistics
    const [
      totalOrders,
      totalSpentResult,
      recentOrdersCount,
      deliveredOrders
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments({ userId }),

      // Total amount spent (only delivered orders)
      Order.aggregate([
        { $match: { userId, status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$billing.totalPaise" } } }
      ]),

      // Recent orders this month
      Order.countDocuments({
        userId,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),

      // Delivered orders count
      Order.countDocuments({ userId, status: "delivered" })
    ]);

    const totalSpentPaise = totalSpentResult[0]?.total || 0;

    // Get recent orders (last 5)
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get most ordered dishes (favorites) based on item names
    const favoriteDishesPipeline = await Order.aggregate([
      { $match: { userId, status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalOrders: { $sum: "$items.qty" },
          lastOrderDate: { $max: "$createdAt" },
          avgPrice: { $avg: "$items.pricePaise" }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          lastOrderDate: 1,
          name: "$_id",
          pricePaise: { $round: "$avgPrice" },
          slug: { $toLower: { $replaceAll: { input: "$_id", find: " ", replacement: "-" } } },
          imageUrl: "/default-dish.jpg"
        }
      }
    ]);

    return apiSuccess({
      stats: {
        totalOrders,
        totalSpentPaise,
        recentOrdersThisMonth: recentOrdersCount,
        deliveredOrders
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        orderNumber: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
        items: order.items.map((item: any) => ({
          name: item.name,
          quantity: item.qty
        })),
        totalPaise: order.billing.totalPaise,
        status: order.status,
        createdAt: order.createdAt,
        deliveryType: order.deliveryType || 'delivery'
      })),
      favoriteDishes: favoriteDishesPipeline.map(dish => ({
        id: dish._id,
        name: dish.name,
        slug: dish.slug,
        orders: dish.totalOrders,
        pricePaise: dish.pricePaise,
        imageUrl: dish.imageUrl,
        lastOrderDate: dish.lastOrderDate
      }))
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return apiError("SERVER_ERROR", "Failed to fetch dashboard statistics", 500);
  }
}