import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Message from "@/models/Message";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const message = await Message.findOne({ _id: new ObjectId(params.id) });
  if (!message)
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  return NextResponse.json(message);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const result = await Message.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: data }
  );
  return NextResponse.json(result);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const result = await Message.deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json(result);
}
