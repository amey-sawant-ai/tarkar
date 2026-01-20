import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { WalletTransaction } from "@/models/WalletTransaction";
import { apiSuccess, apiError, requireAuth, parseBody, validateRequired, generateId } from "@/lib/api-helpers";

// POST /api/wallet/add-money - Add money to wallet
export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    
    await connectToDatabase();
    
    // Check for idempotency key
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey) {
      return apiError("VALIDATION_ERROR", "Idempotency-Key header is required", 400);
    }
    
    const body = await parseBody<{
      amountPaise: number;
      paymentMethodId?: string;
    }>(request);
    
    const validation = validateRequired(body, ["amountPaise"]);
    if (!validation.valid) {
      return apiError("VALIDATION_ERROR", "amountPaise is required", 400, validation.errors);
    }
    
    const { amountPaise, paymentMethodId } = validation.data;
    
    // Validate minimum amount (₹1.00 = 100 paise)
    if (amountPaise < 100 || amountPaise > 10000000) { // Max ₹100,000
      return apiError("VALIDATION_ERROR", "Amount must be between ₹1.00 and ₹100,000", 400);
    }

    // Check for existing transaction with same idempotency key
    const existing = await WalletTransaction.findOne({ 
      userId: auth.userId, 
      idempotencyKey 
    }).lean();
    
    if (existing) {
      const user = await User.findById(auth.userId).lean();
      return apiSuccess({
        balancePaise: user?.walletBalancePaise ?? 0,
        transaction: existing,
      });
    }

    // Update user balance and create transaction atomically
    const session = await User.startSession();
    
    try {
      const result = await session.withTransaction(async () => {
        // Update user balance
        const user = await User.findByIdAndUpdate(
          auth.userId,
          { $inc: { walletBalancePaise: amountPaise } },
          { new: true, session }
        ).lean();
        
        if (!user) {
          throw new Error("User not found");
        }

        // Create transaction record
        const transaction = await WalletTransaction.create([{
          userId: auth.userId,
          type: "credit",
          amountPaise,
          description: `Money added via ${paymentMethodId || "payment"}`,
          balanceAfterPaise: user.walletBalancePaise,
          idempotencyKey,
          reference: generateId("PAY_"),
          status: "completed",
        }], { session });

        return {
          balancePaise: user.walletBalancePaise,
          transaction: transaction[0],
        };
      });
      
      return apiSuccess(result, undefined, 201);
      
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error("Add money error:", error);
    return apiError("SERVER_ERROR", "Failed to add money to wallet", 500);
  }
}
