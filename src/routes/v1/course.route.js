import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  create,
  update,
  list,
  single,
  remove,
} from "../../controllers/course.controller.js";
import checkPermission from "../../middlewares/checkPermission.js";
import permissions from "../../permissions/course.permission.js";
import validation from "../../validations/course.validation.js";
import privateRoute from "../../middlewares/private.js";

const router = express.Router();
router
  .route("/create")
  .post(
    validate(validation.create),
    privateRoute,
    checkPermission(permissions.create),
    create
  );
router
  .route("/update/:id")
  .put(
    validate(validation.update),
    privateRoute,
    checkPermission(permissions.update),
    update
  );
router
  .route("/delete/:id")
  .delete(
    validate(validation.remove),
    privateRoute,
    checkPermission(permissions.delete),
    remove
  );
router.route("/list").get(validate(validation.list), list);
router.route("/single/:id").get(validate(validation.single), single);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

export default router;
