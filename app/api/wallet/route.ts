import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { WalletTransaction } from "@/models/WalletTransaction";
import { apiSuccess, apiError, requireAuth, getPagination } from "@/lib/api-helpers";

// GET /api/wallet - Get wallet balance and recent transactions
export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPagination(request, { page: 1, pageSize: 10 });
    
    // Get user balance
    const user = await User.findById(auth.userId).lean();
    
    if (!user) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    
    // Filter by type
    const type = searchParams.get("type");
    const query: Record<string, unknown> = { userId: auth.userId };
    if (type) {
      query.type = type;
    }
    
    // Get transactions
    const [total, transactions] = await Promise.all([
      WalletTransaction.countDocuments(query),
      WalletTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);
    
    return apiSuccess({
      balancePaise: user.walletBalancePaise || 0,
      transactions,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
    
  } catch (error) {
    console.error("Get wallet error:", error);
    return apiError("SERVER_ERROR", "Failed to get wallet", 500);
  }
}
