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

const router = express.Router();
router.route("/create").post(validate(validation.create), create);
router.route("/update").post(validate(validation.update), update);
router.route("/list").post(validate(validation.list), list);
router.route("/single").post(validate(validation.single), single);
router.route("/delete").post(validate(validation.remove), remove);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
