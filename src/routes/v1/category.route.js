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
router.route("/update").put(validate(validation.update), privateRoute, update);
router
  .route("/delete")
  .delete(validate(validation.remove), privateRoute, remove);
router.route("/list").get(list);
router.route("/single").get(validate(validation.single), single);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
