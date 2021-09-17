import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../utils/response.js";
import { getTokenOwnerId } from "../utils/controllerHelpers/auth/helpers.js";
import voucherCodeIsValid from "../utils/voucherCodeValidator.js";
import moment from "moment-timezone";
import {
  discountCalculator,
  finalPriceCalculator,
  taxCalculator,
} from "../utils/priceCalculators.js";
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const Order = models.order;
const Course = models.course;
const Discount = models.discount;
const UserDiscount = models.userDiscount;
const sendOrderDataToBankGateway = (req, res, order) => {};
export const create = async (req, res) => {
  try {
    const { courseId, voucherCode } = req.body;
    const createObj = {};
    let voucherRecordFound = null;
    const userId = await getTokenOwnerId(req);

    const foundOrder = await Order.findOne({
      row: true,
      where: { courseId, userId },
    });
    if (foundOrder) {
      if (foundOrder.status === "paid") {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "YOU_PAID_THIS_ORDER",
        });
      } else {
        sendOrderDataToBankGateway(foundOrder);
        return response(res, {
          statusCode: httpStatus.CREATED,
          name: "CREATE_ORDER_RETRY",
          details: foundOrder,
        });
      }
    }
    const foundCourse = await Course.findOne({
      row: true,
      where: { id: courseId },
    });
    if (!foundCourse) {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "COURSE_NOT_FOUND",
      });
    }
    if (voucherCode) {
      const validVoucherRecord = await voucherCodeIsValid(
        req,
        res,
        voucherCode
      );
      if (_.isObject(validVoucherRecord) && _.has(validVoucherRecord, "id")) {
        voucherRecordFound = validVoucherRecord;
        createObj.discountId = validVoucherRecord.id;
        createObj.discount_amount = discountCalculator(
          foundCourse.price,
          validVoucherRecord
        );
        const { final_paid_price, tax_amount } = finalPriceCalculator(
          foundCourse.price,
          voucherRecordFound
        );
        createObj.final_paid_price = final_paid_price;
        createObj.tax_amount = tax_amount;
      }
    } else {
      const { final_paid_price, tax_amount } = finalPriceCalculator(
        foundCourse.price
      );
      createObj.final_paid_price = final_paid_price;
      createObj.tax_amount = tax_amount;
    }

    createObj.courseId = courseId;
    createObj.userId = userId;
    createObj.course_primary_price = foundCourse.primary_price;
    createObj.course_final_price = foundCourse.price;

    await Order.create(createObj).then(async (result) => {
      if (result) {
        if (createObj.discountId) {
          await UserDiscount.create({
            userId,
            discountId: createObj.discountId,
          });
        }
        sendOrderDataToBankGateway(result);
        return response(res, {
          statusCode: httpStatus.CREATED,
          name: "CREATE_ORDER",
          details: result,
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};

export const list = async (req, res) => {
  try {
    const { type } = req.query; //image, video
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const single = async (req, res) => {};
export const remove = async (req, res) => {
  try {
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
