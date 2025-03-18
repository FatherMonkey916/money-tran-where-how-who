"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/ui/navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { Search, Send, ArrowRight } from "lucide-react";

export default function TransferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/users/search?q=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter an amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/transfers", {
        toUserId: selectedUser._id,
        amount: parseFloat(amount),
      });

      toast({
        title: "Success",
        description: "Transfer completed successfully",
      });

      // Reset form
      setSelectedUser(null);
      setAmount("");
      setSearchTerm("");
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Transfer failed",
        description: error.response?.data?.error || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Send Money</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <form onSubmit={handleTransfer} className="space-y-6">
              <div className="space-y-2">
                <Label>Recipient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                {users.length > 0 && !selectedUser && (
                  <div className="mt-2 border rounded-md">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setSelectedUser(user);
                          setUsers([]);
                          setSearchTerm(user.name || user.email);
                        }}
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedUser || !amount}
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Send Money"}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Transfer Details</h3>
              {selectedUser ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sending to</p>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                  {amount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold">${amount}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Select a recipient to see transfer details
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Important Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Transfers are processed instantly</li>
                <li>• Recipients will be notified via email</li>
                <li>• Make sure you have sufficient balance</li>
                <li>• Double-check recipient details before sending</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}