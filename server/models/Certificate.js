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
    rollNo: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
