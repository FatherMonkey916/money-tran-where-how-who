'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar';
import  Transaction  from "../../models/Transaction";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Clock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { axiosInstance } from '@/lib/axios';
interface Transaction {
  _id: string;
  type: 'onramp' | 'offramp' | 'transfer';
  from: string;
  to: string;
  amount: number;
  date: string; // ISO string from MongoDB
}
export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Initialize as an empty array
  const [balance, setBalance] = useState<number>(0); // Initialize balance as a number
  const [totalTransactions, setTotalTransactions] = useState<number>(0); // Total number of transactions
  const {id} = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const userId = id;
      console.log(userId);
      const response = await axiosInstance.post('/api/users/dashboard', {
        userId: userId,
      });
      const data = await response.data;
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        const count = transactions.length;
        if(count != 0) {
          setTotalTransactions(count);
          let totalBalance = 0;
          for(let i = 0; i < count; i++) {
            const transaction = data.transactions[i]
            if(transaction.from == userId) totalBalance -= transaction.amount
            else if(transaction.to == userId) totalBalance += transaction.amount
          }
          setBalance(totalBalance);
        }
      // Check if the response contains the expected properties
      // if(data.totalTransactions != 0) {
      //   setTotalTransactions(data.totalTransactions);
      //   let totalBalance = 0;
      //   for(let i = 0; i < data.totalTransactions; i++) {
      //     const transaction = data.transactions[i]
      //     if(transaction.from == userId) totalBalance -= transaction.amount
      //     else if(transaction.to == userId) totalBalance += transaction.amount
      //   }
      //   setBalance(totalBalance);
      // }
      // if (data && typeof data.balance === 'number') {
      //   setBalance(data.balance);
      //   setTotalTransactions(data.totalTransactions);
      // } else {
      //   console.error('Balance is not a number:', data.balance);
      // }
      // Ensure transactions is an array
      } else {
        console.error('Transactions is not an array:', data.transactions);
      }
    };
    fetchData();
  }, [id, transactions.length]);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link href="/ai-chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Assistant
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <h2 className="text-2xl font-bold">${balance}</h2>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Activity</p>
                <h2 className="text-2xl font-bold">{totalTransactions} transfers</h2>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <h2 className="text-2xl font-bold">+15.3%</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-24">
                <Link href="/on-ramp">
                  <ArrowDownLeft className="h-6 w-6 mb-2" />
                  <span>Deposit</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24">
                <Link href="/off-ramp">
                  <ArrowUpRight className="h-6 w-6 mb-2" />
                  <span>Withdraw</span>
                </Link>
              </Button>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center">
                    {(transaction.type === 'onramp' || transaction.to == id) ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">
                        {(transaction.type === 'onramp' || transaction.to == id) ? `From ${transaction.from}` : `To ${transaction.to}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    (transaction.type === 'onramp' || transaction.to == id) ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(transaction.type === 'onramp' || transaction.to == id) ? '+' : '-'}${transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}