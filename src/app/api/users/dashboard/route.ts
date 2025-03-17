import clientPromise from "@/lib/mongodb"; // Ensure this is correctly set up
import TransactionModel from "@/models/Transaction";
import UserModel from "@/models/User"; // Assuming you have a User model
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await clientPromise; // Ensure the database is connected

  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    // Fetch user balance (assuming it's stored in the User model)
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transactions = await TransactionModel.find({
      // $or: [{ "from": userId }, { "to": userId }],
    })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ date: -1 })
      .lean();

    // Get total number of transactions
    let transactionCount = 0;
    for (const transaction of transactions) {
      if (transaction.to._id.toString() === userId.toString() || transaction.from._id.toString() === userId.toString()) {
        transactionCount++;
      }
    }

    let balance = 0;

    for (const transaction of transactions) {
      if (transaction.type === "onramp") {
        // User is receiving money from external source
        if (transaction.to._id.toString() === userId.toString()) {
          balance += transaction.amount;
        }
      } else if (transaction.type === "offramp") {
        // User is sending money to external source
        if (transaction.from._id.toString() === userId.toString()) {
          balance -= transaction.amount;
        }
      } else if (transaction.type === "transfer") {
        // Internal transfer between users
        if (transaction.to._id.toString() === userId.toString()) {
          // User received money
          balance += transaction.amount;
        }
        if (transaction.from._id.toString() === userId.toString()) {
          // User sent money
          balance -= transaction.amount;
        }
      }
    }

    const recentTransactions = transactions.slice(0, 10);

    // console.log("Balance:", balance);
    // console.log("Transactions:", transactions);
    // console.log("Transaction Count:", transactionCount);
    // Return the response with balance, transactions, and total transactions
    return NextResponse.json({
      balance,
      transactionCount,
      recentTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}
