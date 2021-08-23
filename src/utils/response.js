import _ from "lodash";
import httpStatus from "http-status";

export const response = async (
  res,
  { name, statusCode, message = {}, details = {} }
) => {
  return res.status(statusCode).json({
    name,
    statusCode,
    status: _.startsWith(statusCode, "2") ? "ok" : "fail",
    message,
    details,
  });
};
export const exceptionEncountered = (res) =>
  response(res, {
    statusCode: httpStatus.EXPECTATION_FAILED,
    name: "EXPECTATION_FAILED",
    message: "something went wrong, check inputs",
  });
