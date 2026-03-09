import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { WalletTransaction } from "@/models/WalletTransaction";
import { apiSuccess, apiError, requireAuth, parseBody, validateRequired, generateId } from "@/lib/api-helpers";
import { CURRENCY } from "@/lib/constants";

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

    // Validate amount range (Min: ₹10, Max: ₹50,000)
    if (amountPaise < 1000) {
      return apiError("VALIDATION_ERROR", `Minimum amount to add is ${CURRENCY.symbol}10`, 400);
    }
    if (amountPaise > 5000000) {
      return apiError("VALIDATION_ERROR", `Maximum amount per transaction is ${CURRENCY.symbol}50,000`, 400);
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

    // Helper to perform updates without transaction
    const performUpdatesWithoutTransaction = async () => {
      const user = await User.findByIdAndUpdate(
        auth.userId,
        { $inc: { walletBalancePaise: amountPaise } },
        { new: true }
      ).lean();

      if (!user) throw new Error("User not found");

      const transaction = await WalletTransaction.create({
        userId: auth.userId,
        type: "credit",
        amountPaise,
        description: `Money added via ${paymentMethodId || "payment"}`,
        balanceAfterPaise: user.walletBalancePaise,
        idempotencyKey,
        reference: generateId("PAY_"),
        status: "completed",
      });

      return {
        balancePaise: user.walletBalancePaise,
        transaction,
      };
    };

    // Try using a transaction first, but fall back if not supported (standalone instance)
    try {
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

      } catch (txnError: any) {
        // Fallback for standalone server (Error code 20: IllegalOperation)
        if (txnError.code === 20 || txnError.message.includes("replica set")) {
          console.warn("MongoDB transactions not supported, falling back to sequential updates");
          const result = await performUpdatesWithoutTransaction();
          return apiSuccess(result, undefined, 201);
        }
        throw txnError;
      } finally {
        await session.endSession();
      }
    } catch (sessionError: any) {
      // If startSession fails or other session related error
      if (sessionError.code === 20 || sessionError.message.includes("replica set") || sessionError.message.includes("sessions")) {
        console.warn("MongoDB sessions/transactions not supported, falling back to sequential updates");
        const result = await performUpdatesWithoutTransaction();
        return apiSuccess(result, undefined, 201);
      }
      throw sessionError;
    }

  } catch (error) {
    console.error("Add money error:", error);
    return apiError("SERVER_ERROR", "Failed to add money to wallet", 500);
  }
}
