import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function GET() {
  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const data = await req.json();
  const result = await User.insertOne(data);
  return NextResponse.json(result);
}
