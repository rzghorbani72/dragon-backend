import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
import { exceptionEncountered, response } from "../utils/response.js";
import {
  getTokenOwnerId,
  getTokenOwnerRole,
} from "../utils/controllerHelpers/auth/helpers.js";
import { fetchUser } from "../utils/controllerHelpers/user/helper.js";
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const User = models.user;
const File = models.file;

export const list = async (req, res) => {
  const userRole = getTokenOwnerRole(req);
  const { role } = req.query;
  switch (userRole) {
    case "owner": {
      if (_.includes(["owner", "manager", "admin", "author"], role)) {
        return fetchUser({ role }, res);
      } else {
        return fetchUser({}, res);
      }
    }
    case "manager": {
      if (_.includes(["admin", "author"], role)) {
        return fetchUser({ role: role }, res);
      } else {
        return response(res, {
          statusCode: httpStatus.FORBIDDEN,
          name: "FORBIDDEN",
          message: "Access denied",
        });
      }
    }
    case "admin": {
      if (_.includes(["author"], role)) {
        return fetchUser({ role: role }, res);
      } else {
        return response(res, {
          statusCode: httpStatus.FORBIDDEN,
          name: "FORBIDDEN",
          message: "Access denied",
        });
      }
    }
    default: {
      return response(res, {
        statusCode: httpStatus.FORBIDDEN,
        name: "FORBIDDEN",
        message: "Access denied",
      });
    }
  }
};
export const profile = async (req, res) => {
  try {
    const userId = getTokenOwnerId(req);
    const profile = await User.findOne({
      row: true,
      where: { id: userId },
      attributes: [
        "id",
        "full_name",
        "birthday",
        "phone_number",
        "email",
        "role",
        "createdAt",
      ],
    });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "USER_PROFILE",
      details: profile,
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const search = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const foundUser = await User.findOne({
      row: true,
      attributes: ["id", "phone_number"],
      where: { phone_number },
    });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "USER_FOUND",
      message: "successful",
      details: foundUser,
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};

export const update = async (req, res) => {
  try {
    const { id, phone_number, role, imageId } = req.body;
    const updateOptions = {};
    await User.findOne({ row: true, where: { id, phone_number } }).then(
      (result) => {
        if (_.isEmpty(result)) {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "NOT_FOUND",
            message: "user id not found",
          });
        } else {
          if (role) {
            updateOptions.role = role;
          }
        }
      }
    );

    if (imageId) {
      await File.findOne({
        row: true,
        where: { uid: imageId, type: "image" },
      }).then((result) => {
        if (_.isEmpty(result)) {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "NOT_FOUND",
            message: "imageId not found",
          });
        } else {
          updateOptions.fileUid = imageId;
        }
      });
    }

    await User.update(updateOptions, { where: { id, phone_number } });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "USER_MODIFIED",
    });
  } catch (err) {
    await exceptionEncountered(res, err);
  }
};
