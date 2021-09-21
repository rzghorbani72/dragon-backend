import express from "express";
import { validate, ValidationError } from "express-validation";
import {
  create,
  list,
  userOrdersList,
  single,
  remove,
} from "../../controllers/order.controller.js";
import checkPermission from "../../middlewares/checkPermission.js";
import permissions from "../../permissions/order.permission.js";
import validation from "../../validations/order.validation.js";
import privateRoute from "../../middlewares/private.js";

const router = express.Router();
router.route("/create").post(validate(validation.create), privateRoute, create);
//for author and ordinary users fetch their own list
//for owner and admin all users list
router.route("/list").get(validate(validation.create), privateRoute, list);
router
  .route("/list/:userId")
  .get(
    validate(validation.create),
    checkPermission(permissions.userOrdersList),
    privateRoute,
    userOrdersList
  );
router
  .route("/single/:id")
  .get(
    validate(validation.create),
    checkPermission(permissions.list),
    privateRoute,
    single
  );

router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

export default router;
