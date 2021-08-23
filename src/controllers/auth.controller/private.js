import httpStatus from "http-status";
import _ from "lodash";
import { response } from "../../utils/response.js";
import { hasExpireError } from "../../utils/isExpired.js";

export default async (req, res, next) => {
  if (req) {
    const access_token = req.cookies.access_token;

    if (!_.isEmpty(access_token)) {
      const hasError = await hasExpireError({ token: access_token });
      if (!hasError) {
        next();
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
