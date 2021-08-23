import _ from "lodash";
import httpStatus from "http-status";

export const response = async (
  res,
  {
    name,
    statusCode,
    message = {},
    details = {},
    cookieObject = {},
    clearCookieObject = {},
  }
) => {
  if (!_.isEmpty(clearCookieObject) && _.has(clearCookieObject, "key")) {
    return res
      .clearCookie(clearCookieObject.key)
      .status(statusCode)
      .json({
        name,
        statusCode,
        status: _.startsWith(statusCode, "2") ? "ok" : "fail",
        message,
        details,
      });
  } else if (
    !_.isEmpty(cookieObject) &&
    _.has(cookieObject, "key") &&
    _.has(cookieObject, "value")
  ) {
    return res
      .cookie(cookieObject.key, cookieObject.value, {
        httpOnly: true,
        secure: false,
      })
      .status(statusCode)
      .json({
        name,
        statusCode,
        status: _.startsWith(statusCode, "2") ? "ok" : "fail",
        message,
        details,
      });
  } else {
    return res.status(statusCode).json({
      name,
      statusCode,
      status: _.startsWith(statusCode, "2") ? "ok" : "fail",
      message,
      details,
    });
  }
};
export const exceptionEncountered = (res, error = null) =>
  response(res, {
    statusCode: httpStatus.EXPECTATION_FAILED,
    name: "EXPECTATION_FAILED",
    message: error
      ? { message: error.message, name: error.name }
      : "something went wrong, check inputs",
  });
