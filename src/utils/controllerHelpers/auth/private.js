import httpStatus from "http-status";
import _ from "lodash";
import { response } from "../../response.js";
import { hasExpireError } from "../../isExpired.js";
import { checkUserPermission } from "./helpers.js";

export default async (req, res, next) => {
  if (req) {
    const access_token = req.cookies.access_token;

    if (!_.isEmpty(access_token)) {
      const hasError = await hasExpireError({ token: access_token });
      if (!hasError) {
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
        hasError.clearCookieObject = { key: "access_token" };
        await response(res, hasError);
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
