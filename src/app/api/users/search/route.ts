import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await clientPromise;

    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get search query from URL
    const url = new URL(req.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    // Search users by name or email, excluding the current user
    const users = await User.find({
      _id: { $ne: payload.sub }, // Exclude current user
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name email") // Only return necessary fields
      .limit(5); // Limit results

    return NextResponse.json(users);
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}