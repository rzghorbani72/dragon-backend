import express from "express";
import multer from "multer";
import { validate, ValidationError } from "express-validation";
import {
  create,
  remove,
  single,
  list,
} from "../../controllers/file.controller.js";
import { imageUpload, videoUpload } from "../../utils/uploader.js";
import privateRoute from "../../utils/controllerHelpers/auth/private.js";
import { response } from "../../utils/response.js";
import httpStatus from "http-status";
import validation from "../../validations/file.validation.js";

const router = express.Router();
router
  .route("/upload/image")
  // @ts-ignore
  .post(imageUpload.single("image"), privateRoute, create);
router
  .route("/upload/video")
  // @ts-ignore
  .post(videoUpload.single("video"), privateRoute, create);
router.route("/list/:courseId").get(validate(validation.list), list);
router.route("/single/:uid").get(single);
router.route("/remove/:uid").delete(privateRoute, remove);

router.use(function (err, req, res, next) {
  // Check if the error is thrown from multer
  if (err instanceof multer.MulterError) {
    return response(res, {
      statusCode: httpStatus.BAD_REQUEST,
      name: "BAD_REQUEST",
      message: err.code,
      details: err,
    });
  } else if (err) {
    // If it is not multer error then check if it is our custom error for FILE_MISSING
    if (err.message === "FILE_MISSING") {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "BAD_REQUEST",
        message: "FILE_MISSING",
        details: err,
      });
    } else {
      //For any other errors set code as GENERIC_ERROR
      if (err.name === "ValidationError") {
        return response(res, err);
      } else {
        return response(res, {
          statusCode: httpStatus.SERVICE_UNAVAILABLE,
          name: "SERVICE_UNAVAILABLE",
          message: "GENERIC_ERROR",
          details: err,
        });
      }
    }
  }
});
router.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});
export default router;
