import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import { exceptionEncountered, response } from "../../utils/response.js";

const Op = db.Sequelize.Op;
const models = db.models;
const AccessToken = models.accessToken;

export default async (req, res) => {
  try {
    const access_token = req.cookies.access_token;
    const tokenRecord = await AccessToken.findOne({
      where: { token: access_token },
    });
    if (!_.isEmpty(tokenRecord?.dataValues)) {
      await AccessToken.destroy({
        where: {
          userId: tokenRecord["dataValues"]["userId"],
        },
      });

      return response(res, {
        name: "LOG_OUT",
        statusCode: httpStatus.OK,
        message: "logged out and token destroyed",
        clearCookieObject: { key: "access_token" },
      });
    } else {
      return response(res, {
        name: "TOKEN_NOTFOUND",
        statusCode: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    return exceptionEncountered(res, error);
  }
};
