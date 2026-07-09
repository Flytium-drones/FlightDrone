import mongoose from "mongoose";

const storeHeroSchema = new mongoose.Schema({
  badgeText: { type: String, default: "Best Price Available" },
  title: { type: String, default: "Flytium Nano Drone" },
  subtitle: { type: String, default: "DIY Kit for Smart Learning & Fun Flying" },
  description: { type: String, default: "Build, control, and explore advanced flight features in a compact nano drone." },
  image: { type: String, default: "" },
  price: { type: Number, default: 2999 },
  discountedPrice: { type: Number, default: 2499 },
  features: [{
    icon: { type: String },
    title: { type: String }
  }],
  productInfo: [{
    icon: { type: String },
    title: { type: String },
    description: { type: String }
  }],
  whyChoose: [{
    icon: { type: String },
    title: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model("StoreHero", storeHeroSchema);
