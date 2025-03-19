import { NextResponse, type NextRequest } from "next/server"
import Transaction, { type ITransaction } from "@/models/Transaction"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, amount, userId } = body
    if (!email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const paypalUrl = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"

    // Get access token
    const authResponse = await fetch(`${paypalUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    const authData = await authResponse.json()

    if (!authResponse.ok) {
      console.error("PayPal auth error:", authData)
      return NextResponse.json({ error: "Failed to authenticate with PayPal" }, { status: 500 })
    }

    const transactions = await Transaction.find({})
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ date: -1 })
      .lean();

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

    if (balance < amount) {
      console.warn(`Insufficient balance: available=${balance}, requested=${amount}`);
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create payout
    const payoutResponse = await fetch(`${paypalUrl}/v1/payments/payouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        sender_batch_header: {
          sender_batch_id: `Payouts_${Date.now()}`,
          email_subject: "You have a payout!",
          email_message: "You have received a payout! Thanks for using our service!",
        },
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: amount.toString(),
              currency: "USD",
            },
            receiver: email,
            note: "Thanks for your patronage!",
            sender_item_id: `Payment_${Date.now()}`,
          },
        ],
      }),
    })

    const payoutData = await payoutResponse.json()

    if (!payoutResponse.ok) {
      console.error("PayPal payout error:", payoutData)
      return NextResponse.json({ error: "Failed to create PayPal payout" }, { status: 500 })
    }

    const newTransaction: Partial<ITransaction> = {
        type: "offramp",
        from: userId as string,
        to: "67d9a9a9f12bf81e3abd5924",
        amount: amount.toString(),
        date: new Date(),
      }

    await Transaction.create(newTransaction)

    return NextResponse.json({ success: true, payout: payoutData })
  } catch (error) {
    console.error("Error creating PayPal payout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
