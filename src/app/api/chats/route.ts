import { NextResponse } from 'next/server';
import Chat from '@/models/Chat';

export async function GET() {
  const chats = await Chat.find({});
  return NextResponse.json(chats);
}

export async function POST(req: Request) {
  const data = await req.json();
  const result = await Chat.insertOne(data);
  return NextResponse.json(result);
}
