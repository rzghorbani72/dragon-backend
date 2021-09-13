import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../utils/response.js";
import { getTokenOwnerId } from "../utils/controllerHelpers/auth/helpers.js";
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const Order = models.order;
const File = models.file;

export default async (req, res, next) => {
  try {
    const { uid } = req.params;
    const userId = await getTokenOwnerId(req);
    await File.findOne({ row: true, where: { uid } }).then(
      async (fileResult) => {
        //
        const { courseId } = fileResult;
        if (fileResult && courseId) {
          await Order.findOne({
            row: true,
            where: { userId, courseId: fileResult.courseId },
          }).then(async (orderResult) => {
            if (orderResult?.status === "paid") {
              next();
            } else {
              return response(res, {
                statusCode: httpStatus.FORBIDDEN,
                name: "ACCESS_DENIED",
                message: "user did not pay for this course",
                details: {
                  status: orderResult ? orderResult.status : null,
                },
              });
            }
          });
        } else {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "NOT_FOUND",
            message: "video not found",
          });
        }
      }
    );
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
