import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this campaign."],
  },
  area: {
    type: String,
    required: [true, "Please provide an area for this campaign."],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  totalScanned: {
    type: Number,
    default: 0,
  },
  anemiaDetected: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", CampaignSchema);
