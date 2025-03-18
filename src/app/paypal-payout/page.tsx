"use client"
import { useState } from "react"
import axios from "axios"
import { useAuth } from '@/contexts/auth-context';

const PayPalPayout = () => {
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("")
  const {id} = useAuth();
  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Processing...")

    try {
      await axios.post("/api/paypal/payout", { email, amount: parseFloat(amount), userId: id})
      setStatus("Payout successful!")
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/dashboard`
    } catch (error) {
      console.error("Payout error:", error)
      setStatus("Payout failed. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl md:text-3xl font-bold mt-2 md:mt-5 mb-6">Send Payout</h2>

      <form onSubmit={handlePayout} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Recipient Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (USD)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send Payout
        </button>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  )
}

export default PayPalPayout