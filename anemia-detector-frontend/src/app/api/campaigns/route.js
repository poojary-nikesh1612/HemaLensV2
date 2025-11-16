import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

async function connectToDb() {
  const client = await clientPromise;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET: Fetch all campaigns for the logged-in user
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectToDb();
    const campaigns = await Campaign.find({ createdBy: session.user.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST: Create a new campaign
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectToDb();

    const newCampaign = await Campaign.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(
      { success: true, data: newCampaign },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
