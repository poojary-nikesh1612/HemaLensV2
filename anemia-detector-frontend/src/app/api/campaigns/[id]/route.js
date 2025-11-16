import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import Patient from "@/lib/models/Patient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

async function connectToDb() {
  const client = await clientPromise;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET: Fetch a single campaign and its patients
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectToDb();
    const { id } = await params;

    const campaign = await Campaign.findOne({
      _id: id,
      createdBy: session.user.id,
    });
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    const patients = await Patient.find({ campaignId: id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: { campaign, patients } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE: Delete a campaign AND all its patients
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectToDb();
    const { id } = params;

    const campaign = await Campaign.findOne({
      _id: id,
      createdBy: session.user.id,
    });
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Delete all patients associated with this campaign
    await Patient.deleteMany({ campaignId: id });

    // Delete the campaign itself
    await Campaign.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Campaign and all patients deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
