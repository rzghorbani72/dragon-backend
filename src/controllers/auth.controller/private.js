import httpStatus from "http-status";
import _ from "lodash";
import { response } from "../../utils/response.js";
import { hasExpireError } from "../../utils/isExpired.js";

export default async (req, res, next) => {
  if (req) {
    const headers = req.headers;
    if (headers.authorization) {
      const hasError = await hasExpireError({ token: headers.authorization });
      if (!hasError) {
        next();
      } else {
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
