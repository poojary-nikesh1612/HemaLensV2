import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import mongoose from "mongoose";

async function connectToDb() {
  const client = await clientPromise;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

//increments the totalScanned counter
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectToDb();
    const { id: campaignId } = await params;

    const campaign = await Campaign.findOne({
      _id: campaignId,
      createdBy: session.user.id,
    });
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    const updateStats = {
      $inc: { totalScanned: 1 },
    };

    await Campaign.findByIdAndUpdate(campaignId, updateStats);

    return NextResponse.json({ success: true, message: "Scan count updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
