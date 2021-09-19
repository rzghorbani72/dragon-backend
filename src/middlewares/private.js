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
        if (await checkUserPermission(req)) {
          next();
        } else {
          return response(res, {
            statusCode: httpStatus.FORBIDDEN,
            name: "FORBIDDEN",
            message: "access denied",
          });
        }
      } else {
        res.clearCookie("access_token");
        await response(res, tokenData);
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
