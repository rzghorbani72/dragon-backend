import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
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
export const list = async (req, res) => {
  try {
    const { type } = req.query; //image, video
    await File.findAll({
      where: _.includes(["image", "video"], type) ? { type } : {},
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
export const single = async (req, res) => {
  try {
    const { uid } = req.params;
    await File.findOne({
      where: { uid },
      row: true,
    }).then((result) => {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "FETCH_FILE",
        message: "fetched successfully",
        details: result,
      });
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
