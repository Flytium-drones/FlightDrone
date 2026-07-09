// server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; // Import admin order routes
import cartRoutes from "./routes/cartRoutes.js"; // Import cart routes
import heroRoutes from "./routes/heroRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import storeHeroRoutes from "./routes/storeHeroRoutes.js";

// Connect to the database
connectDB();

const app = express();

// CORS Configuration for Production
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://www.flytiumdrones.com",
          "https://flight-drone-eta.vercel.app",
        ],
        imgSrc: ["'self'", "data:", "https:", "https://res.cloudinary.com"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ["'self'", "https://api.razorpay.com"],
      },
    },
  })
);

// Force HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/payment", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/storehero", storeHeroRoutes);
app.use("/api/ad", adRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/contact", contactRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
