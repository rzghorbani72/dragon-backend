import moment from "moment-timezone";
import db from "../models/index.js";
import httpStatus from "http-status";
import _ from "lodash";
import { decodeUserToken } from "./controllerHelpers/auth/helpers.js";

const models = db.models;
const AccessToken = models.accessToken;

export const hasExpireError = async ({ token = null, code = null }) => {
  if (token) {
    //const tokenRecord = await AccessToken.findOne({ where: { token } });
    const decodedTokenString = decodeUserToken(token);
    const decodedTokenJson = JSON.parse(decodedTokenString);
    if (
      !_.isEmpty(decodedTokenJson) &&
      _.isObject(decodedTokenJson) &&
      _.has(decodedTokenJson, "id") &&
      _.has(decodedTokenJson, "expires")
    ) {
      const isExpiredToken = moment(decodedTokenJson.expires).isBefore();
      if (isExpiredToken) {
        return {
          statusCode: httpStatus.FORBIDDEN,
          name: "EXPIRED",
          message: `expired token`,
        };
      } else {
        if (code) {
          const validateCode = await validateSmsCode(code);
          if (validateCode?.codeValidated) {
            return {
              id: decodedTokenJson.id,
              phone_number: decodedTokenJson.phone_number,
              expires: decodedTokenJson.expires,
              codeValidated: true,
              tokenValidated: true,
            };
          }
        } else {
          return {
            id: decodedTokenJson.id,
            phone_number: decodedTokenJson.phone_number,
            expires: decodedTokenJson.expires,
            tokenValidated: true,
          };
        }
      }
    } else {
      return {
        statusCode: httpStatus.UNAUTHORIZED,
        name: "UNAUTHORIZED",
        message: "invalid token",
      };
    }
  }

  if (code) {
    await validateSmsCode(code);
  }
};
const validateSmsCode = async (code) => {
  const codeRecord = await AccessToken.findOne({ where: { code } });
  if (_.isObject(codeRecord) && !_.isEmpty(codeRecord)) {
    const isExpiredCode = moment(
      codeRecord["dataValues"][`code_expire`]
    ).isBefore();
    if (isExpiredCode) {
      return {
        statusCode: httpStatus.FORBIDDEN,
        name: "EXPIRED",
        message: `expired code`,
      };
    } else {
      return {
        codeValidated: true,
        userId: codeRecord["dataValues"]["userId"],
      };
    }
  } else {
    return {
      statusCode: httpStatus.NOT_FOUND,
      name: `CODE_NOT_FOUND`,
      message: `wrong code`,
    };
  }
};
