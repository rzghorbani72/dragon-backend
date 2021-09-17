import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
import { exceptionEncountered, response } from "../utils/response.js";
import moment from "moment-timezone";
import voucher_codes from "voucher-code-generator";
const isFalse = (x) => _.includes(["false", false], x);
const isTrue = (x) => _.includes(["true", true], x);

const Op = db.Sequelize.Op;
const models = db.models;
const Discount = models.discount;
const UserDiscount = models.userDiscount;
const User = models.user;

export const randomVoucherGenerator = async (req, res) => {
  try {
    const { prefix, postfix, length, count } = req.body;
    const randObj = {};
    if (count) randObj.count = count;
    else randObj.count = 5;
    if (length) randObj.length = length;
    else randObj.length = 5;
    if (postfix) randObj.postfix = postfix;
    if (prefix) randObj.prefix = prefix;

    const randomVoucher = voucher_codes.generate(randObj);
    if (randomVoucher)
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CREATE_RANDOM_VOUCHER",
        details: randomVoucher,
      });
    else
      return response(res, {
        statusCode: httpStatus.SERVICE_UNAVAILABLE,
        name: "ERROR_WITH_GENERATOR",
      });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};

export const create = async (req, res) => {
  try {
    const { name, type, apply_to, value, userId, expiredAt } = req.body;
    const foundVoucher = await Discount.findOne({ row: true, where: { name } });

    if (!foundVoucher) {
      if (apply_to === "one" && !userId) {
        return response(res, {
          statusCode: httpStatus.BAD_REQUEST,
          name: "CREATE_VOUCHER",
          message: "apply_to = one needs userId",
        });
      }
      if (type === "percent") {
        if (Number(value) > 90) {
          return response(res, {
            statusCode: httpStatus.BAD_REQUEST,
            name: "CREATE_VOUCHER",
            message:
              "voucher type=percent value can not be more than 90 percent",
          });
        }
      }
      if (apply_to === "one" && userId) {
        const foundUser = await User.findOne({
          row: true,
          where: { id: userId },
        });
        if (!foundUser) {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "CREATE_VOUCHER",
            message: "userId not found",
          });
        }
      }

      await Discount.create({
        name,
        type,
        user_apply_limitations: apply_to,
        value,
        userId: userId ? userId : null,
        expiredAt,
      }).then(async (result) => {
        if (result) {
          return response(res, {
            statusCode: httpStatus.CREATED,
            name: "CREATE_VOUCHER",
            message: "discount coucher created successfully",
            details: result,
          });
        } else {
          return response(res, {
            statusCode: httpStatus.BAD_REQUEST,
            name: "CREATE_VOUCHER",
          });
        }
      });
    } else {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "CREATE_VOUCHER",
        message: "voucher unique error",
      });
    }
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, value, apply_to, userId, expiredAt } = req.body;
    const updateObj = {};
    if (name) updateObj.name = name;
    if (value) updateObj.value = value;
    if (type) updateObj.type = type;
    if (apply_to) updateObj.user_apply_limitations = apply_to;
    if (userId) updateObj.userId = userId;
    if (expiredAt) updateObj.expiredAt = expiredAt;
    await Discount.findOne({
      row: true,
      where: { id },
    }).then(async (result) => {
      if (apply_to === "one" && !userId) {
        return response(res, {
          statusCode: httpStatus.BAD_REQUEST,
          name: "UPDATE_VOUCHER",
          message: "apply_to = one needs userId",
        });
      }
      if (type === "percent") {
        if (Number(value) > 90) {
          return response(res, {
            statusCode: httpStatus.BAD_REQUEST,
            name: "CREATE_VOUCHER",
            message:
              "voucher type=percent value can not be more than 90 percent",
          });
        }
      }
      if (apply_to === "one" && userId) {
        const foundUser = await User.findOne({
          row: true,
          where: { id: userId },
        });
        if (!foundUser) {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "UPDATE_VOUCHER",
            message: "userId not found",
          });
        }
      }
      const isUsedOrApplied = await UserDiscount.findOne({
        row: true,
        where: { discountId: id },
      });
      if (isUsedOrApplied)
        return response(res, {
          statusCode: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
          name: "UNAVAILABLE_FOR_LEGAL_REASONS",
          message: "unable to update ,this voucher code used before",
        });

      if (result) {
        await Discount.update(updateObj, { where: { id } }).then(
          (updateResult) => {
            if (updateResult) {
              return response(res, {
                statusCode: httpStatus.OK,
                name: "UPDATE_DISCOUNT",
                message: "updated successfully",
              });
            } else {
              return response(res, {
                statusCode: httpStatus.BAD_REQUEST,
                name: "BAD_REQUEST",
                message: "updated failed",
              });
            }
          }
        );
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOTFOUND",
          message: "updated not found",
        });
      }
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const list = async (req, res) => {
  try {
    const { isExpired } = req.query;

    const whereObj = {};
    if (isExpired === "true") {
      whereObj.expiredAt = {
        [Op.lt]: Date.now(),
      };
    } else if (isExpired === "false") {
      whereObj.expiredAt = {
        [Op.gt]: Date.now(),
      };
    }
    const list = await Discount.findAll({
      row: true,
      where: whereObj,
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!_.isEmpty(list)) {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "DISCOUNT_LIST",
        details: list,
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "NOTFOUND",
      });
    }
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const single = async (req, res) => {
  try {
    const { name } = req.params;
    const foundVoucherCode = await Discount.findOne({
      row: true,
      where: { name },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (foundVoucherCode) {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "VOUCHER_CODE",
        details: foundVoucherCode,
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "NOTFOUND",
      });
    }
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Discount.destroy({ where: { id } }).then((result) => {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "DISCOUNT_DELETE",
        message: `id ${id} deleted`,
      });
    });
  } catch (err) {
    exceptionEncountered(res, err);
  }
};

export const check = async (req, res) => {
  try {
    const { name } = req.params;

    const foundVoucherCode = await Discount.findOne({
      row: true,
      where: { name },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (foundVoucherCode) {
      const foundUsedCode = await UserDiscount.findOne({
        row: true,
        where: {
          discountId: foundVoucherCode.id,
          userId: foundVoucherCode.userId,
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
        return response(res, {
          statusCode: httpStatus.OK,
          name: "VOUCHER_CODE_VALID",
          details: foundVoucherCode,
        });
      }
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "NOTFOUND",
      });
    }
  } catch (err) {
    exceptionEncountered(res, err);
  }
};
