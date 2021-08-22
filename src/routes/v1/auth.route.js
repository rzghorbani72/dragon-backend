import express from "express";
import { validate, ValidationError } from "express-validation";
import authenticateController from "../../controllers/auth.controller/authentication.js";
import retryController from "../../controllers/auth.controller/retry.js";
import logoutController from "../../controllers/auth.controller/logout.js";
import registerController from "../../controllers/auth.controller/register.js";
import verificationController from "../../controllers/auth.controller/verification.js";
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
