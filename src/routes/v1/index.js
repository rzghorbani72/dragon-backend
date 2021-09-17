import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import categoryRoutes from "./category.route.js";
import courseRoutes from "./course.route.js";
import otpRoutes from "./otp.route.js";
import fileRoutes from "./file.route.js";
import discountRoutes from "./discount.route.js";
import orderRoutes from "./order.route.js";
//import paymentRoutes from "./payment.route.js";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/discount", discountRoutes);
router.use("/course", courseRoutes);
router.use("/order", orderRoutes);
router.use("/file", fileRoutes);
router.use("/otp", otpRoutes);

export default router;
