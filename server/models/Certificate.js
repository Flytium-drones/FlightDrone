import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    grade: {
      type: String,
    },
    description: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
