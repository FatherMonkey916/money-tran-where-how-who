import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Chat from "@/models/Chat";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const chat = await Chat.findOne({ _id: new ObjectId(params.id) });
  if (!chat)
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  return NextResponse.json(chat);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const result = await Chat.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: data }
  );
  return NextResponse.json(result);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await Chat.deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json(result);
}
