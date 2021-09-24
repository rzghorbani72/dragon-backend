import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  update,
  list,
  search,
  profile,
} from "../../controllers/user.controller.js";
import checkPermission from "../../middlewares/checkPermission.js";
import permissions from "../../permissions/user.permission.js";
import validations from "../../validations/user.validation.js";
import privateRoute from "../../middlewares/private.js";

const router = express.Router();

router.route("/update").put(validate(validations.update), privateRoute, update);
router.route("/profile").get(privateRoute, profile);

router
  .route("/list")
  .get(
    validate(validations.list),
    privateRoute,
    checkPermission(permissions.list),
    list
  );
router
  .route("/search")
  .post(validate(validations.search), privateRoute, search);

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
