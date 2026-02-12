import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    stipend: { type: String },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    status: { type: String, enum: ["Open", "Closed", "Reviewing"], default: "Open" },
    applicantsCount: { type: Number, default: 0 },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
