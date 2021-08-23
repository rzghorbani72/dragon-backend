import express from "express";
import authRoutes from "./auth.route.js";
import categoryRoutes from "./category.route.js";
import courseRoutes from "./course.route.js";
import videoRoutes from "./video.route.js";
import otpRoutes from "./otp.route.js";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/course", courseRoutes);
router.use("/video", videoRoutes);
router.use("/otp", otpRoutes);

export default router;
