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
    const balance = user.balance; // Adjust according to your User model
    // Fetch the latest 10 transactions for the user
    const transactions = await TransactionModel.find({
      $or: [{ from: userId }, { to: userId }],
    }) // Assuming transactions are linked to a user
      .sort({ date: -1 }) // Sort by date descending
      .limit(10)
      .lean(); // Use lean for better performance
    // Get total number of transactions
    const totalTransactions = await TransactionModel.countDocuments({
      userId,
    });
    // Return the response with balance, transactions, and total transactions
    return NextResponse.json({
      balance,
      transactions,
      totalTransactions,
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
