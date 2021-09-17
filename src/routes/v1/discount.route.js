import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  create,
  update,
  list,
  single,
  remove,
  check,
  randomVoucherGenerator,
} from "../../controllers/discount.controller.js";
import validation from "../../validations/discount.validation.js";
import privateRoute from "../../middlewares/private.js";

const router = express.Router();
router.route("/create").post(validate(validation.create), privateRoute, create);
router
  .route("/update/:id")
  .put(validate(validation.update), privateRoute, update);
router
  .route("/delete/:id")
  .delete(validate(validation.remove), privateRoute, remove);
router.route("/list").get(validate(validation.list), privateRoute, list);
router
  .route("/single/:name")
  .get(validate(validation.single), privateRoute, single);
router
  .route("/check/:name")
  .get(validate(validation.check), privateRoute, check);
router
  .route("/voucherGenerator")
  .post(validate(validation.generator), privateRoute, randomVoucherGenerator);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

export default router;
