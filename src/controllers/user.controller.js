import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
import { exceptionEncountered, response } from "../utils/response.js";
import { getTokenOwnerRole } from "../utils/controllerHelpers/auth/helpers.js";
import { fetchUser } from "../utils/controllerHelpers/user/helper.js";
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const User = models.user;

export const list = async (req, res) => {
  const userRole = await getTokenOwnerRole(req);
  const { type } = req.body;
  switch (userRole) {
    case "owner": {
      if (_.includes(["owner", "manager", "admin", "author"], type)) {
        await fetchUser({ role: type }, res);
      } else {
        return response(res, {
          statusCode: httpStatus.FORBIDDEN,
          name: "FORBIDDEN",
          message: "Access denied",
        });
      }
    }
    case "manager": {
      if (_.includes(["admin", "author"], type)) {
        await fetchUser({ role: type }, res);
      } else {
        return response(res, {
          statusCode: httpStatus.FORBIDDEN,
          name: "FORBIDDEN",
          message: "Access denied",
        });
      }
    }
    case "admin": {
      if (_.includes(["author"], type)) {
        await fetchUser({ role: type }, res);
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
    const { id, phone_number, role } = req.body;
    const foundUser = await User.findOne({ where: { id, phone_number } });
    if (
      !_.includes(["owner", "manager", "admin", "author", "ordinary"], role)
    ) {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "BAD_REQUEST",
        message: "wrong role",
      });
    }
    if (foundUser) {
      await User.update({ role }, { where: { id, phone_number } });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "USER_MODIFIED",
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "USER_NOTFOUND",
      });
    }
  } catch (err) {
    await exceptionEncountered(res, err);
  }
};
