import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCertificateController,
  getAllCertificatesController,
  deleteCertificateController,
  verifyCertificateController,
} from "../controllers/certificateController.js";

const router = express.Router();

// Routes

// Create a new certificate (Admin only)
router.post("/create", requireSignIn, isAdmin, createCertificateController);

// Get all certificates (Admin only)
router.get("/get-all", requireSignIn, isAdmin, getAllCertificatesController);

// Delete a certificate (Admin only)
router.delete("/delete/:id", requireSignIn, isAdmin, deleteCertificateController);

// Verify a certificate (Public)
router.get("/verify/:certificateId", verifyCertificateController);

export default router;
