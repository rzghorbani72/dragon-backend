import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  create,
  update,
  list,
  single,
  remove,
} from "../../controllers/category.controller.js";
import checkPermission from "../../middlewares/checkPermission.js";
import permissions from "../../permissions/category.permission.js";
import validation from "../../validations/category.validation.js";
import privateRoute from "../../middlewares/private.js";

const router = express.Router();
router
  .route("/create")
  .post(
    validate(validation.create),
    checkPermission(permissions.create),
    privateRoute,
    create
  );
router
  .route("/update/:id")
  .put(
    validate(validation.update),
    checkPermission(permissions.update),
    privateRoute,
    update
  );
router
  .route("/delete/:id")
  .delete(
    validate(validation.remove),
    checkPermission(permissions.delete),
    privateRoute,
    remove
  );
router.route("/list").get(list);
router.route("/single/:id").get(validate(validation.single), single);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
