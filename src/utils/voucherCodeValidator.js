import moment from "moment-timezone";
import db from "../models/index.js";
import httpStatus from "http-status";
import _ from "lodash";
import { response } from "../utils/response.js";
import { getTokenOwnerId } from "./controllerHelpers/auth/helpers.js";

const models = db.models;
const Discount = models.discount;
const UserDiscount = models.userDiscount;

export default async (req, res, voucherCode) => {
  const userId = await getTokenOwnerId(req);

  const foundVoucherCode = await Discount.findOne({
    row: true,
    where: { name: voucherCode },
  });
  if (foundVoucherCode) {
    if (
      foundVoucherCode.user_apply_limitations === "one" &&
      String(foundVoucherCode.userId) !== String(userId)
    ) {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "VOUCHER_CODE_IS_NOT_VALID_FOR_THIS_USER",
      });
    }
    const foundUsedCode = await UserDiscount.findOne({
      row: true,
      where: {
        discountId: foundVoucherCode.id,
        userId,
        status: "usedInPayment",
      },
    });
    if (foundUsedCode) {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "VOUCHER_CODE_IS_USED",
      });
    }
    const isExpired = moment(foundVoucherCode.expiredAt).isBefore();
    if (isExpired) {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "VOUCHER_CODE_EXPIRED",
      });
    } else {
      return foundVoucherCode.dataValues;
    }
  } else {
    return response(res, {
      statusCode: httpStatus.NOT_FOUND,
      name: "VOUCHER_CODE_NOT_FOUND",
    });
  }
};
