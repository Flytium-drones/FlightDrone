import express from "express";
import { getStoreHero, updateStoreHero } from "../controllers/storeHeroController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get", getStoreHero);
router.put("/update", requireSignIn, isAdmin, updateStoreHero);

export default router;
