import httpStatus from "http-status";
import _ from "lodash";
import { response } from "../utils/response.js";
import { hasExpireError } from "../utils/isExpired.js";
import { checkUserPermission } from "../utils/controllerHelpers/auth/helpers.js";

export default async (req, res, next) => {
  if (req) {
    const access_token = req.cookies.access_token;

    if (!_.isEmpty(access_token)) {
      const tokenData = await hasExpireError({ token: access_token });
      if (
        !_.isEmpty(tokenData) &&
        _.isObject(tokenData) &&
        tokenData.tokenValidated &&
        _.has(tokenData, "id") &&
        _.has(tokenData, "phone_number") &&
        _.has(tokenData, "expires")
      ) {
        const hasPermission = await checkUserPermission(req);
        if (hasPermission) {
          next();
        } else {
          return response(res, {
            statusCode: httpStatus.FORBIDDEN,
            name: "FORBIDDEN",
            message: "access denied",
          });
        }
      } else if (_.has(tokenData, "statusCode")) {
        res.clearCookie("access_token");
        tokenData.clearCookieObject = { key: "access_token" };
        return response(res, tokenData);
      } else {
        res.clearCookie("access_token");
        return response(res, {
          statusCode: httpStatus.UNAUTHORIZED,
          name: "UNAUTHORIZED",
          clearCookieObject: { key: "access_token" },
          message: "token parse problem",
        });
      }
    } else {
      return response(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        name: "UNAUTHORIZED",
        message: "private api",
      });
    }
  }
};
