import httpStatus from "http-status";
import db from "../../../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../../response.js";

const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const User = models.user;

export const fetchUser = async (obj = {}, res) => {
  try {
    const users = await User.findAll({
      raw: true,
      attributes: ["id", "phone_number", "role"],
      where: obj,
    });
    if (users) {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "OK",
        message: "successful",
        details: { users },
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "NOT_FOUND",
        message: "not found",
        details: { users },
      });
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
