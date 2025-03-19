import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { sendEmail } from "@/lib/email";
import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";

async function calculateUserBalance(userId: string): Promise<number> {
  const transactions = await Transaction.find({ $or: [{ from: userId }, { to: userId }] }).lean();
  let balance = 0;

  for (const transaction of transactions) {
    if (transaction.type === "onramp" && transaction.to.toString() === userId) {
      balance += transaction.amount;
    } else if (transaction.type === "offramp" && transaction.from.toString() === userId) {
      balance -= transaction.amount;
    } else if (transaction.type === "transfer") {
      if (transaction.to.toString() === userId) {
        balance += transaction.amount;
      }
      if (transaction.from.toString() === userId) {
        balance -= transaction.amount;
      }
    }
  }

  return balance;
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Transfer request received`);

  try {
    // Authentication code remains the same
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn(
        `[${requestId}] Unauthorized request - missing or invalid authorization header`
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    if (!payload) {
      console.warn(`[${requestId}] Invalid token provided`);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log(`[${requestId}] User authenticated: ${payload.sub}`);

    const { toUserId, amount } = await req.json();
    console.log(
      `[${requestId}] Transfer request: from=${payload.sub}, to=${toUserId}, amount=${amount}`
    );

    if (!toUserId || !amount || amount <= 0) {
      console.warn(
        `[${requestId}] Invalid transfer parameters: toUserId=${toUserId}, amount=${amount}`
      );
      return NextResponse.json(
        { error: "Invalid transfer parameters" },
        { status: 400 }
      );
    }

    // Get both users without using a session
    const fromUser = await User.findById(payload.sub);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      console.warn(
        `[${requestId}] User not found: fromUser=${!!fromUser}, toUser=${!!toUser}`
      );
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(
      `[${requestId}] Users found: from=${fromUser.name}, to=${toUser.name}`
    );

    // Calculate sender's balance from transaction history
    const userId = fromUser._id.toString();
    const transactions = await Transaction.find({})
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ date: -1 })
      .lean();

    console.log(
      `[${requestId}] Retrieved ${transactions.length} transactions for balance calculation`
    );

    let balance = 0;

    for (const transaction of transactions) {
      if (transaction.type === "onramp") {
        if (transaction.to._id.toString() === userId) {
          balance += transaction.amount;
        }
      } else if (transaction.type === "offramp") {
        if (transaction.from._id.toString() === userId) {
          balance -= transaction.amount;
        }
      } else if (transaction.type === "transfer") {
        if (transaction.to._id.toString() === userId) {
          balance += transaction.amount;
        }
        if (transaction.from._id.toString() === userId) {
          balance -= transaction.amount;
        }
      }
    }

    console.log(`[${requestId}] Calculated balance for sender: ${balance}`);

    // Check if sender has enough balance
    if (balance < amount) {
      console.warn(
        `[${requestId}] Insufficient balance: available=${balance}, requested=${amount}`
      );
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create transaction record without using a session
    const transaction = new Transaction({
      type: "transfer",
      from: fromUser._id,
      to: toUser._id,
      amount: amount,
      date: new Date(),
    });

    await transaction.save();
    console.log(
      `[${requestId}] Transaction record created: ${transaction._id}`
    );

    // Recalculate balances after the transaction for email notification
    const newFromBalance = balance - amount;
    const newToBalance = await calculateUserBalance(toUser._id.toString());

    // Send email notification
    try {
      const emailContent = `
        Hello ${toUser.name},

        You have received a transfer of ${amount} from ${fromUser.name}.
        
        Your new balance is: ${newToBalance}

        Best regards,
        FOCO.chat Team
      `;

      await sendEmail({
        to: toUser.email,
        subject: "Money Received on FOCO.chat",
        text: emailContent,
      });
      console.log(`[${requestId}] Notification email sent to ${toUser.email}`);
    } catch (emailError) {
      console.error(
        `[${requestId}] Error sending email notification:`,
        emailError
      );
    }

    console.log(`[${requestId}] Transfer completed successfully`);
    return NextResponse.json({
      message: "Transfer successful",
      transaction: transaction,
    });
  } catch (error) {
    console.error(`[${requestId}] Transfer error:`, error);
    return NextResponse.json(
      { error: "Failed to process transfer" },
      { status: 500 }
    );
  }
}