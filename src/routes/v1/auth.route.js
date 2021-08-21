import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  authenticateController,
  verificationController,
  retryController,
  logoutController,
  registerController,
} from "../../controllers/auth.controller/index.js";
import validations from "../../validations/auth.validation.js";

const router = express.Router();
router
  .route("/register")
  .post(validate(validations.register), registerController);

router
  .route("/login")
  .post(validate(validations.authenticate), authenticateController);

router
  .route("/verify")
  .post(validate(validations.verification), verificationController);

router.route("/retry").post(validate(validations.retry), retryController);
router.route("/logout").post(validate(validations.logout), logoutController);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
