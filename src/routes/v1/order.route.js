import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  create,
  list,
  single,
  remove,
} from "../../controllers/order.controller.js";
import validation from "../../validations/order.validation.js";
import privateRoute from "../../middlewares/private.js";

const router = express.Router();
router.route("/create").post(validate(validation.create), privateRoute, create);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

export default router;
