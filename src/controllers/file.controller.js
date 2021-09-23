import httpStatus from "http-status";
import db from "../models/index.js";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { exceptionEncountered, response } from "../utils/response.js";
import { getTokenOwnerId } from "../utils/controllerHelpers/auth/helpers.js";
import { fstat } from "fs";
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const File = models.file;
const Course = models.course;
const __dirname = path.resolve();
const blankImage = "src/staticFiles/blank.jpeg";
export const create = async (req, res) => {
  try {
    const _userId = getTokenOwnerId(req);
    let uid = req.file.filename.split("_")[1].split(".")[0];
    uid = Number(uid);
    const errors = {};
    if (req.body.courseId) {
      await Course.findOne({
        row: true,
        where: { id: req.body.courseId },
      }).then(async (courseResult) => {
        if (!courseResult) {
          errors.course = "COURSE_NOT_FOUND";
          // return response(res, {
          //   statusCode: httpStatus.NOT_FOUND,
          //   name: "COURSE_NOT_FOUND",
          // });
        }
      });
    }

    await File.create({
      originalname: req.file.originalname,
      filename: req.file.filename,
      encoding: req.file.encoding,
      destination: req.file.destination,
      path: req.file.path,
      size: req.file.size,
      type: req.file.fieldname,
      mimetype: req.file.mimetype,
      private: _.includes(["true", true], req.body.isPrivate),
      title: req.body.title,
      description: req.body.description,
      order: req.body.order,
      uploaderId: _userId,
      courseId:
        req.body.courseId && !_.has(errors, "course")
          ? req.body.courseId
          : null,
      uid,
    }).then((result) => {
      if (result) {
        return response(res, {
          statusCode: httpStatus.CREATED,
          name: "FILE_UPLOAD",
          message: `${req.file.fieldname} uploaded successfully`,
          details: {
            errors,
            uid: result.uid,
            size: result.size,
            filename: result.filename,
          },
        });
      } else {
        return response(res, {
          errors,
          statusCode: httpStatus.BAD_REQUEST,
          name: "FILE_UPLOAD",
          message: `${req.file.fieldname} does not uploaded`,
          details: req.file,
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const update = async (req, res) => {
  try {
    const { uid } = req.params;
    const options = {};
    if (req.body.courseId) {
      await Course.findOne({
        row: true,
        where: { id: req.body.courseId },
      }).then(async (courseResult) => {
        if (!courseResult) {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "COURSE_NOT_FOUND",
          });
        } else {
          options.courseId = courseResult.id;
        }
      });
    }

    if (req.body.isPrivate)
      options.isPrivate = _.includes(["true", true], req.body.isPrivate);
    if (req.body.order) options.order = req.body.order;
    if (req.body.title) options.title = req.body.title;
    if (req.body.description) options.description = req.body.description;

    await File.update(options, {
      where: { uid },
    }).then((result) => {
      if (result?.length) {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "FILE_UPDATE",
          message: `updated successfully`,
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const list = async (req, res) => {
  try {
    const { type } = req.query; //image, video
    const { courseId } = req.params;
    await File.findAll({
      where: _.includes(["image", "video"], type)
        ? { type, courseId }
        : { courseId },
      attributes: ["uid", "private", "title"],
      row: true,
    }).then((results) => {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "FETCH_FILES",
        message: "fetched successfully",
        details: {
          count: results.length,
          list: results,
        },
      });
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const getImage = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid, type: "image" },
      //attributes: ["uid", "title"],
      row: true,
    }).then((result) => {
      if (result) {
        const address = path.join(__dirname, result.path);
        res.status(httpStatus.OK).sendFile(address);
      } else {
        const address = path.join(__dirname, blankImage);
        res.status(httpStatus.OK).sendFile(address);
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const getVideo = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid, isPrivate: false },
      row: true,
    }).then(async (result) => {
      if (result) {
        const address = path.join(__dirname, result.path);
        res.status(httpStatus.OK).sendFile(address);
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: "video not found",
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const getStreamVideo = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid, isPrivate: false },
      row: true,
    }).then(async (result) => {
      if (result) {
        const address = path.join(__dirname, result.path);
        res.status(httpStatus.OK).sendFile(address);
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: "video not found",
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};

//download
export const getPrivateVideo = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid, isPrivate: true },
      row: true,
    }).then(async (result) => {
      if (result) {
        const address = path.join(__dirname, result.path);
        res.status(httpStatus.OK).sendFile(address);
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: "video not found",
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const getStreamPrivateVideo = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid, isPrivate: false },
      row: true,
    }).then(async (result) => {
      if (result) {
        // await privateRoute(req,res);
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: "video not found",
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const remove = async (req, res) => {
  try {
    const { uid } = req.params;

    const foundFile = await File.findOne({ row: true, where: { uid } });
    if (foundFile) {
      const address = path.join(__dirname, foundFile.path);

      await File.update({ courseId: null }, { where: { uid } });
      const result = await File.destroy({
        where: { uid },
      });
      //
      if (result) {
        fs.unlinkSync(address);
        return response(res, {
          statusCode: httpStatus.OK,
          name: "FILE_DELETE",
          message: `uid ${uid} deleted`,
        });
      } else {
        return response(res, {
          statusCode: httpStatus.FAILED_DEPENDENCY,
          name: "FAILED_DEPENDENCY",
        });
      }
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "FILE_DELETE",
        message: `uid ${uid} not found`,
      });
    }
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
