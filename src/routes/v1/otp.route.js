import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  sendCodeToPhone,
  verifyCode,
} from "../../controllers/otp.controller.js";
import validations from "../../validations/otp.validation.js";

const router = express.Router();
router.route("/sendSms").post(validate(validations.sendSms), sendCodeToPhone);

router.route("/verify").post(validate(validations.verifyCode), verifyCode);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
