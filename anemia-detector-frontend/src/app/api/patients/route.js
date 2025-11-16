import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Campaign from "@/lib/models/Campaign";
import Patient from "@/lib/models/Patient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

async function connectToDb() {
  const client = await clientPromise;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// POST: Create a new patient AND update the anemiaDetected count
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectToDb();
    const body = await request.json();
    const { campaignId, result } = body;

    const newPatient = await Patient.create(body);

    if (result === "Anemic") {
      await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { anemiaDetected: 1 },
      });
    }

    return NextResponse.json(
      { success: true, data: newPatient },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
