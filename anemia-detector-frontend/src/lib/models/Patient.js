import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide the patient's name."],
  },
  age: {
    type: Number,
    required: [true, "Please provide the patient's age."],
  },
  gender: {
    type: String,
    required: [true, "Please provide the patient's gender."],
  },
  phone: {
    type: String,
    required: [true, "Please provide the patient's phone number."],
  },
  result: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);
