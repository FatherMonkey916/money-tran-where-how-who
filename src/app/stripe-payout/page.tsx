"use client"
import { useState } from "react"
import type React from "react"

import axios from "axios"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from '@/contexts/auth-context';

const StripePayout = () => {
  const {id} = useAuth();
  const [amount, setAmount] = useState(10)
  const [accountId, setAccountId] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Check for success or error status from URL params
  const isSuccess = searchParams.get("success") === "true"
  const isError = searchParams.get("error") === "true"
  const errorMessage = searchParams.get("message")

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value)
    setAmount(newValue)
  }

  const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountId(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  const handlePayout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!accountId) {
        throw new Error("AccountId is required")
      }

      if (amount <= 0) {
        throw new Error("Amount must be greater than 0")
      }

      const res = await axios.post("/api/stripe/payout", {
        amount,
        accountId,
        description: description || `Payout to ${accountId}`,
        userId: id as string,
      })

      // Redirect to success page
      window.location.href = `/stripe-payout?success=true`
    } catch (error) {
      console.error("error", error)
      setError(error instanceof Error ? error.message : "Payout failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <p className="text-orange-500 text-sm md:text-lg uppercase tracking-wider mt-2 md:mt-5">- SEND MONEY -</p>
      <h2 className="text-2xl md:text-3xl font-bold mt-2 md:mt-5 mb-6">Send Money to Users</h2>

      {isSuccess && (
        <div className="w-full max-w-3xl bg-green-100 text-green-800 rounded-lg p-4 mb-6">
          Payout initiated successfully! The money will be sent to the user.
        </div>
      )}

      {isError && (
        <div className="w-full max-w-3xl bg-red-100 text-red-800 rounded-lg p-4 mb-6">
          {errorMessage || "Payout failed. Please try again."}
        </div>
      )}

      {error && <div className="w-full max-w-3xl bg-red-100 text-red-800 rounded-lg p-4 mb-6">{error}</div>}

      <div className="w-full max-w-3xl bg-blue-100 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8">Send Money with Stripe</h3>

          <div className="mb-6">
            <label htmlFor="accountId" className="block text-lg font-bold mb-2 text-left">
              Recipient accountId
            </label>
            <input
              type="accountId"
              id="accountId"
              className="w-full p-2 border border-gray-300 rounded"
              value={accountId}
              onChange={handleAccountIdChange}
              placeholder="acct_1234567890"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-lg font-bold mb-2 text-left">
              Amount (USD)
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-2 border border-gray-300 rounded"
              value={amount}
              onChange={handleAmountChange}
              min={1}
              step={1}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-bold mb-2 text-left">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Payment for services"
            />
          </div>

          <div className="flex flex-col items-center mb-6">
            <button
              className="bg-indigo-600 text-white rounded-xl px-6 py-3 flex items-center justify-center space-x-2 w-full max-w-md mx-auto disabled:bg-indigo-400 mb-4"
              onClick={handlePayout}
              disabled={isLoading}
            >
              <span className="text-xl font-bold">{isLoading ? "Processing..." : "Send Money"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StripePayout

