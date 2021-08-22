import moment from "moment-timezone";
import db from "../models/index.js";
import httpStatus from "http-status";
import _ from "lodash";

const models = db.models;
const AccessToken = models.accessToken;

export const hasExpireError = async ({ token = null, code = null }) => {
  if (token) {
    const tokenRecord = await AccessToken.findOne({ where: { token } });
    if (tokenRecord) {
      const isExpiredToken = moment(
        tokenRecord["dataValues"][`token_expire`]
      ).isBefore();
      if (isExpiredToken) {
        return {
          statusCode: httpStatus.FORBIDDEN,
          name: "EXPIRED",
          message: `expired token`,
        };
      }
      return false;
    } else {
      return {
        statusCode: httpStatus.UNAUTHORIZED,
        name: "UNAUTHORIZED",
        message: "Token Not Found",
      };
    }
  }

  if (code) {
    const codeRecord = await AccessToken.findOne({ where: { code } });
    if (codeRecord) {
      const isExpiredCode = moment(
        codeRecord["dataValues"][`code_expire`]
      ).isBefore();
      if (isExpiredCode) {
        return {
          statusCode: httpStatus.FORBIDDEN,
          name: "EXPIRED",
          message: `expired code`,
        };
      } else return false;
    } else {
      return {
        statusCode: httpStatus.NOT_FOUND,
        name: `CODE_NOT_FOUND`,
        message: `wrong code`,
      };
    }
  }
};
