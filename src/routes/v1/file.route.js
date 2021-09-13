import express from "express";
import multer from "multer";
import { validate, ValidationError } from "express-validation";
import {
  create,
  remove,
  list,
  update,
  getImage,
  getVideo,
  getPrivateVideo,
  getStreamVideo,
  getStreamPrivateVideo,
} from "../../controllers/file.controller.js";
import { imageUpload, videoUpload } from "../../utils/uploader.js";
import privateRoute from "../../middlewares/private.js";
import shouldBePaid from "../../middlewares/checkPaid.js";

import { response } from "../../utils/response.js";
import httpStatus from "http-status";
import validation from "../../validations/file.validation.js";

const router = express.Router();
router
  .route("/upload/image")
  // @ts-ignore
  .post(privateRoute, imageUpload.single("image"), create);
router
  .route("/upload/video")
  // @ts-ignore
  .post(
    privateRoute,
    videoUpload.single("video"),
    validate(validation.uploadVideo),
    create
  );
router
  .route("/update/:uid")
  .get(validate(validation.updateFile), privateRoute, update);
router.route("/list/:courseId").get(validate(validation.list), list);
router.route("/image/:uid").get(getImage);
router.route("/stream/:uid").get(getStreamVideo);
router
  .route("/privateStream/:uid")
  .get(privateRoute, shouldBePaid, getStreamPrivateVideo);
router.route("/downloadVideo/:uid").get(getVideo);
router
  .route("/downloadPrivateVideo/:uid")
  .get(privateRoute, shouldBePaid, getPrivateVideo);
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
