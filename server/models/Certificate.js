import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
