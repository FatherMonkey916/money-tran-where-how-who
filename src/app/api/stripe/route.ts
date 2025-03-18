import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import Transaction, { type ITransaction } from "@/models/Transaction"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Update the API version to a currently supported version
  apiVersion: "2025-02-24.acacia",
})

export async function POST(req: NextRequest) {
  console.log("stripe pay request received");
  try {
    const username = "Anonymous"
    const { value, userId } = await req.json()
    if (!value) {
      return NextResponse.json({ error: "Missing required field: value" }, { status: 400 })
    }

    // Add logging to debug
    console.log("Creating checkout session with:", {
      priceId: process.env.STRIPE_PRICE_ID,
      quantity: value,
      successUrl: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/transfer`,
      cancelUrl: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/stripe?canceled=true`,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: value,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/transfer`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/stripe?canceled=true`,
      metadata: {
        quantity: value,
        username,
      },
    })

    const newTransaction: Partial<ITransaction> = {
      type: "onramp",
      from: userId as string,
      to: "Stripe",
      amount: value,
      date: new Date(),
    }

    await Transaction.create(newTransaction)

    return NextResponse.json({ id: session.id })
  } catch (error) {
    // Improve error logging
    console.error("Error creating checkout session:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

