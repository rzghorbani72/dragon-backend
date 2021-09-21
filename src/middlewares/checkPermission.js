import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../utils/response.js";
import {
  getTokenOwnerId,
  getTokenOwnerRole,
} from "../utils/controllerHelpers/auth/helpers.js";
import {
  AUTHOR_PERMISSIONS,
  ADMIN_PERMISSIONS,
  OWNER_PERMISSIONS,
} from "../config/permissions.js";

export default (permission) => {
  return function (req, res, next) {
    const role = getTokenOwnerRole(req);
    if (role === "author") {
      //
      if (_.includes(AUTHOR_PERMISSIONS, permission)) {
        next();
      } else {
        //
        return accessDenied(res);
      }
    } else if (role === "admin") {
      if (_.includes(ADMIN_PERMISSIONS, permission)) {
        next();
      } else {
        return accessDenied(res);
      }
    } else if (role === "owner") {
      if (_.includes(OWNER_PERMISSIONS, permission)) {
        next();
      } else {
        return accessDenied(res);
      }
    } else {
      return accessDenied(res);
    }
  };
};
const accessDenied = (res) =>
  response(res, {
    statusCode: httpStatus.FORBIDDEN,
    name: "FORBIDDEN",
    message: "Access denied",
  });
