import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  create,
  update,
  list,
  single,
  remove,
} from "../../controllers/category.controller.js";
import validation from "../../validations/category.validation.js";
import privateRoute from "../../controllers/auth.controller/private.js";

const router = express.Router();
router.route("/create").post(validate(validation.create), privateRoute, create);
router.route("/update").put(validate(validation.update), update);
router.route("/list").get(privateRoute, list);
router.route("/single").get(validate(validation.single), single);
router.route("/delete").delete(validate(validation.remove), remove);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
