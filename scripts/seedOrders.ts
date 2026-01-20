import connectToDatabase from "../lib/mongodb";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { Dish } from "../models/Dish";

// Sample order data for demo user
const sampleOrdersData = [
  {
    items: [
      { dishId: null, name: "Butter Chicken", qty: 2, pricePaise: 35000 },
      { dishId: null, name: "Garlic Naan", qty: 3, pricePaise: 8000 },
      { dishId: null, name: "Basmati Rice", qty: 1, pricePaise: 15000 },
    ],
    deliveryType: "delivery",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    status: "delivered",
    notes: "Extra spicy please",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    items: [
      { dishId: null, name: "Dal Tadka", qty: 1, pricePaise: 22000 },
      { dishId: null, name: "Roti", qty: 4, pricePaise: 6000 },
      { dishId: null, name: "Mixed Vegetable Curry", qty: 1, pricePaise: 28000 },
    ],
    deliveryType: "pickup",
    status: "ready",
    notes: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    items: [
      { dishId: null, name: "Chicken Biryani", qty: 1, pricePaise: 45000 },
      { dishId: null, name: "Raita", qty: 1, pricePaise: 12000 },
    ],
    deliveryType: "delivery",
    address: "456 Park Avenue, Delhi, Delhi 110001",
    status: "out-for-delivery",
    notes: "Ring the bell twice",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    items: [
      { dishId: null, name: "Masala Dosa", qty: 2, pricePaise: 18000 },
      { dishId: null, name: "Sambhar", qty: 2, pricePaise: 8000 },
      { dishId: null, name: "Coconut Chutney", qty: 2, pricePaise: 5000 },
    ],
    deliveryType: "delivery",
    address: "789 Beach Road, Chennai, Tamil Nadu 600001",
    status: "preparing",
    notes: "Make it less oily",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    items: [
      { dishId: null, name: "Paneer Tikka", qty: 1, pricePaise: 32000 },
      { dishId: null, name: "Tandoori Roti", qty: 2, pricePaise: 7000 },
      { dishId: null, name: "Mint Chutney", qty: 1, pricePaise: 4000 },
    ],
    deliveryType: "pickup",
    status: "confirmed",
    notes: "",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
];

async function seedOrders() {
  try {
    console.log("🌱 Starting orders seeding...");

    await connectToDatabase();
    console.log("✅ Connected to database");

    // Find demo user
    const demoUser = await User.findOne({ email: "demo@tarkari.com" });
    if (!demoUser) {
      console.log("❌ Demo user not found. Please create demo user first.");
      return;
    }

    console.log(`📧 Found demo user: ${demoUser.email}`);

    // Get some existing dishes for realistic itemIds
    const dishes = await Dish.find().limit(20);
    if (dishes.length === 0) {
      console.log("❌ No dishes found. Please seed dishes first.");
      return;
    }

    console.log(`🍽️ Found ${dishes.length} dishes to use in orders`);

    // Clear existing orders for demo user
    await Order.deleteMany({ userId: demoUser._id.toString() });
    console.log("🗑️ Cleared existing demo orders");

    // Create sample orders with real dish IDs
    const ordersToCreate = sampleOrdersData.map((orderData, orderIndex) => {
      const { deliveryType, address, status, notes, createdAt } = orderData;
      
      // Map items to real dishes
      const items = orderData.items.map((item, itemIndex) => {
        const dishIndex = (orderIndex * 3 + itemIndex) % dishes.length;
        const dish = dishes[dishIndex];
        return {
          itemId: dish._id.toString(),
          name: dish.name,
          qty: item.qty,
          pricePaise: dish.pricePaise,
        };
      });
      
      // Calculate billing
      const subTotalPaise = items.reduce((sum, item) => sum + (item.pricePaise * item.qty), 0);
      const taxPaise = Math.round(subTotalPaise * 0.05);
      const deliveryFeePaise = deliveryType === "delivery" ? 5000 : 0;
      const totalPaise = subTotalPaise + taxPaise + deliveryFeePaise;

      // Create timeline based on status
      const timeline = [
        {
          status: "order-placed",
          label: "Order Placed",
          at: createdAt,
          completed: true,
        },
      ];

      if (["confirmed", "preparing", "ready", "out-for-delivery", "delivered"].includes(status)) {
        timeline.push({
          status: "confirmed",
          label: "Order Confirmed",
          at: new Date(createdAt.getTime() + 5 * 60 * 1000),
          completed: true,
        });
      }

      if (["preparing", "ready", "out-for-delivery", "delivered"].includes(status)) {
        timeline.push({
          status: "preparing",
          label: "Being Prepared",
          at: new Date(createdAt.getTime() + 15 * 60 * 1000),
          completed: true,
        });
      }

      if (["ready", "out-for-delivery", "delivered"].includes(status)) {
        timeline.push({
          status: "ready",
          label: "Ready for Pickup",
          at: new Date(createdAt.getTime() + 25 * 60 * 1000),
          completed: true,
        });
      }

      if (["out-for-delivery", "delivered"].includes(status) && deliveryType === "delivery") {
        timeline.push({
          status: "out-for-delivery",
          label: "Out for Delivery",
          at: new Date(createdAt.getTime() + 35 * 60 * 1000),
          completed: true,
        });
      }

      if (status === "delivered") {
        timeline.push({
          status: "delivered",
          label: "Delivered",
          at: new Date(createdAt.getTime() + 45 * 60 * 1000),
          completed: true,
        });
      }

      return {
        userId: demoUser._id.toString(),
        status,
        items,
        timeline,
        address: deliveryType === "delivery" ? address : "",
        deliveryType,
        billing: {
          subTotalPaise,
          taxPaise,
          deliveryFeePaise,
          discountPaise: 0,
          totalPaise,
          paymentMethod: "online",
        },
        notes,
        placedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      };
    });

    await Order.insertMany(ordersToCreate);
    console.log(`✅ Created ${ordersToCreate.length} sample orders for demo user`);

    const orderCounts = await Order.aggregate([
      { $match: { userId: demoUser._id.toString() } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    console.log("📊 Order counts by status:");
    orderCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} orders`);
    });

    console.log("🎉 Orders seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedOrders().then(() => {
    console.log("🏁 Seeding process finished");
    process.exit(0);
  });
}

export default seedOrders;