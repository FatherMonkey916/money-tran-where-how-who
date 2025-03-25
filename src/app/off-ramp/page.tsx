'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building, Wallet } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OffRamp() {
  // const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const router = useRouter();
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${method}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Withdraw Funds</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">Available balance: $2,500.00</p>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe-payout">Stripe</SelectItem>
                    <SelectItem value="paypal-payout">Paypal</SelectItem>
                    <SelectItem value="mtn-payout">MTN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Withdrawal Methods</h3>
              <div className="space-y-4">
                <div className="flex flex-row gap-2 items-center p-3 bg-secondary rounded-lg">
                  <Image src="https://stripe.com/img/v3/home/twitter.png" alt="Stripe" width={30} height={30} />

                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">Offers a highly scalable and flexible payment system with global reach, supporting over 46 countries and 135+ currencies, making it ideal for international businesses</p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center p-3 bg-secondary rounded-lg">
                  <Image
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    width={30} height={30}
                  />

                  <div>
                    <p className="font-medium">Paypal</p>
                    <p className="text-sm text-muted-foreground">Provides a secure and widely accepted payment method with buyer protection, allowing users to make purchases without sharing bank or card details, enhancing security and convenience</p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center p-3 bg-secondary rounded-lg">
                  <div className="flex flex-row items-center w-[30px] h-[30px]">
                  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" width={40} height={40}>
                    <defs>
                      <style>
                        {`.cls-1{fill:#ffcb05;}.cls-2{fill:#00678f;}.cls-3{fill:#fff;}.cls-4{fill:#ed1d24;}`}
                      </style>
                    </defs>
                    <title>mtn-mobile</title>
                    <polygon className="cls-1" points="0 122.88 122.88 122.88 122.88 0 0 0 0 122.88 0 122.88" />
                    <path className="cls-2" d="M119,61.09c0,13.11-25.78,23.75-57.58,23.75S3.85,74.2,3.85,61.09s25.79-23.75,57.6-23.75S119,48,119,61.09Z" />
                    <polygon className="cls-3" points="24.55 72.81 30.5 49.06 40.02 49.06 40.02 62.89 46.27 49.06 56.1 49.06 50.15 72.81 43.89 72.81 47.46 57.48 40.02 72.81 34.97 72.81 34.97 57.48 31.09 72.81 24.55 72.81 24.55 72.81" />
                    <polygon className="cls-4" points="58.02 73.11 58.91 69.8 65.76 69.8 64.86 73.11 58.02 73.11 58.02 73.11" />
                    <polygon className="cls-3" points="73.34 72.81 79.29 49.06 86.14 49.06 89.12 61.69 92.39 49.06 98.64 49.06 92.69 72.81 86.14 72.81 82.87 59.88 79.59 72.81 73.34 72.81 73.34 72.81" />
                    <polygon className="cls-1" points="58.02 49.06 56.53 55.08 62.79 55.08 59.42 68.12 66.26 68.12 69.64 55.08 75.88 55.08 77.37 49.06 58.02 49.06 58.02 49.06" />
                  </svg>
                  </div>
                  <div>
                    <p className="font-medium">MTN</p>
                    <p className="text-sm text-muted-foreground">Facilitates financial inclusion by offering convenient and secure financial services to millions in Africa, enabling users to perform a wide range of transactions directly from their mobile phones</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Important Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Minimum withdrawal: $10</li>
                <li>• Maximum withdrawal: $5,000 per day</li>
                <li>• No withdrawal fees</li>
                <li>• Bank transfers may take 1-3 business days</li>
                <li>• Digital wallet transfers are instant</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}