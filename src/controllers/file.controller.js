import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../utils/response.js";
import { getTokenOwnerId } from "../utils/controllerHelpers/auth/helpers.js";
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const File = models.file;

export const create = async (req, res) => {
  try {
    const _userId = await getTokenOwnerId(req);
    let uid = req.file.filename.split("_")[1].split(".")[0];
    uid = Number(uid);
    await File.create({
      originalname: req.file.originalname,
      filename: req.file.filename,
      encoding: req.file.encoding,
      destination: req.file.destination,
      path: req.file.path,
      size: req.file.size,
      type: req.file.fieldname,
      mimetype: req.file.mimetype,
      private: _.includes(["true", true], req.body.private),
      title: req.body.title,
      description: req.body.description,
      order: req.body.order,
      uploaderId: _userId,
      uid: Number(uid),
    }).then((result) => {
      if (result) {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "FILE_UPLOAD",
          message: `${req.file.fieldname} uploaded successfully`,
          details: {
            uid: result.uid,
            size: result.size,
            filename: result.filename,
          },
        });
      } else {
        return response(res, {
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
    const { id } = req.params;
    await File.update(
      {
        private: _.includes(["true", true], req.body.private),
        order: req.body.order,
        title: req.body.title,
        description: req.body.description,
      },
      {
        where: { id },
      }
    ).then((result) => {
      if (result) {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "FILE_UPLOAD",
          message: `${req.file.fieldname} uploaded successfully`,
          details: {
            uid: result.uid,
            size: result.size,
            filename: result.filename,
          },
        });
      } else {
        return response(res, {
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
      attributes: ["uid", "title"],
      row: true,
    }).then((result) => {
      if (result) {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "FETCH_IMAGE",
          message: "fetched successfully",
          details: result,
        });
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
        });
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
export const getStreamVideo = async (req, res) => {
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

export const getPrivateVideo = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid, isPrivate: true },
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
    await File.destroy({ where: { uid } }).then((result) => {
      if (result) {
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
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
