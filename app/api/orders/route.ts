import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Dish } from "@/models/Dish";
import { Favorite } from "@/models/Favorite";
import { getUserId, apiSuccess, apiError } from "@/lib/api-helpers";
import { PRICING } from "@/lib/constants";

interface OrderBody {
  items: Array<{
    dishId: string;
    quantity: number;
  }>;
  deliveryAddress?: string;
  deliveryType: "delivery" | "pickup";
  paymentMethod: string;
  notes?: string;
}

// GET user's orders
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);

    const query: any = { userId };
    if (status === "active") {
      query.status = {
        $in: [
          "order-placed",
          "confirmed",
          "preparing",
          "ready",
          "out-for-delivery",
        ],
      };
    } else if (status === "completed") {
      query.status = { $in: ["delivered", "cancelled"] };
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select({
        _id: 1,
        status: 1,
        items: 1,
        billing: 1,
        deliveryType: 1,
        address: 1,
        createdAt: 1,
        placedAt: 1,
        timeline: 1
      })
      .lean();

    // Add deliveryType field if missing (for backward compatibility)
    const ordersWithDeliveryType = orders.map(order => ({
      ...order,
      deliveryType: order.deliveryType || (order.address ? 'delivery' : 'pickup')
    }));

    return apiSuccess(ordersWithDeliveryType, {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return apiError("SERVER_ERROR", "Failed to fetch orders", 500);
  }
}

// POST - Create new order
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserId(req);
    if (!userId) {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }

    const body: OrderBody = await req.json();
    const { items, deliveryAddress, deliveryType, paymentMethod, notes } =
      body;

    if (!items || items.length === 0) {
      return apiError("VALIDATION_ERROR", "Cart is empty", 400);
    }

    if (deliveryType === "delivery" && !deliveryAddress) {
      return apiError("VALIDATION_ERROR", "Delivery address required for delivery orders", 400);
    }

    // Validate dishes exist and get correct prices
    const orderItems = [];
    let subTotalPaise = 0;

    for (const item of items) {
      const dish = await Dish.findById(item.dishId);
      if (!dish) {
        return apiError("NOT_FOUND", `Dish ${item.dishId} not found`, 404);
      }

      const itemTotal = dish.pricePaise * item.quantity;
      subTotalPaise += itemTotal;

      orderItems.push({
        itemId: item.dishId,
        name: dish.name,
        qty: item.quantity,
        pricePaise: dish.pricePaise,
      });
    }

    // Calculate totals
    const taxPaise = Math.round(subTotalPaise * (PRICING.taxPercent / 100));
    const deliveryFeePaise = deliveryType === "delivery" ? PRICING.deliveryFee : 0;
    const totalPaise = subTotalPaise + taxPaise + deliveryFeePaise;

    // Create order
    const order = await Order.create({
      userId,
      status: "order-placed",
      items: orderItems,
      billing: {
        subTotalPaise,
        taxPaise,
        deliveryFeePaise,
        discountPaise: 0,
        totalPaise,
        paymentMethod,
      },
      deliveryType,
      address: deliveryAddress || null,
      notes: notes || "",
      timeline: [
        {
          status: "order-placed",
          label: "Order Placed",
          at: new Date(),
          completed: true,
        },
      ],
      placedAt: new Date(),
    });

    // Update favorite stats for ordered dishes
    const orderedDishIds = items.map((item) => item.dishId);
    await Favorite.updateMany(
      { userId, dishId: { $in: orderedDishIds } },
      {
        $inc: { orderCount: 1 },
        $set: { lastOrderedAt: new Date() }
      }
    );

    return apiSuccess(order, undefined, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return apiError("SERVER_ERROR", "Failed to create order", 500);
  }
}
