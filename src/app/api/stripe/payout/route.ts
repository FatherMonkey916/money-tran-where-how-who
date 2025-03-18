import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import Transaction, { type ITransaction } from "@/models/Transaction"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(req: NextRequest) {
  console.log("stripe payout request received")
  try {
    const { amount, accountId, description, userId } = await req.json()
    if (!amount || !accountId) {
      return NextResponse.json({ error: "Missing required fields: amount and accountId" }, { status: 400 })
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100)

    // Add logging to debug
    console.log("Creating payout with:", {
      amount: amountInCents,
      accountId,
      description,
    })

    try {
      // First, create a recipient if they don't exist
      // Note: In a production app, you would check if the recipient already exists
      const recipient = await stripe.transfers.create({
        amount: amountInCents,
        currency: "usd",
        destination: accountId, // This would typically be a Stripe account ID
        description: description || `Payout to ${accountId}`,
      })

      // Record the transaction in your database
      const newTransaction: Partial<ITransaction> = {
        type: "offramp",
        from: "67b2d1c93903f5962eb3f028",
        to: userId as string,
        amount: amount,
        date: new Date(),
      }

      await Transaction.create(newTransaction)

      return NextResponse.json({
        success: true,
        message: "Payout initiated successfully",
        id: recipient.id,
      })
    } catch (stripeError) {
      console.error("Stripe error:", stripeError)

      // Handle specific Stripe errors
      if (stripeError instanceof Stripe.errors.StripeError) {
        return NextResponse.json(
          {
            error: stripeError.message,
          },
          { status: 400 },
        )
      }

      throw stripeError // Re-throw for general error handling
    }
  } catch (error) {
    // Improve error logging
    console.error("Error creating payout:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        error: "Error creating payout",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

