import { NextResponse } from 'next/server';
import Message from '@/models/Message';

export async function GET() {
  const messages = await Message.find({});
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const data = await req.json();
  const result = await Message.insertOne(data);
  return NextResponse.json(result);
}
