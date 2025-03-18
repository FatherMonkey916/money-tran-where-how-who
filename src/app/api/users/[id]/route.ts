import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import User from '@/models/User';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = await User.findOne({ _id: new ObjectId(id) });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  const result = await User.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const result = await User.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json(result);
}
