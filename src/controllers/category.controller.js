import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import crypto from "crypto";
import { hasExpireError } from "../utils/isExpired.js";
import { response } from "../utils/response.js";
import randomNumber from "random-number-csprng";
const isFalse = (x) => _.includes(["false", false], x);
const isTrue = (x) => _.includes(["true", true], x);

const Op = db.Sequelize.Op;
const models = db.models;
const Category = models.category;

export const create = async (req, res) => {
  try {
    const { token, name, parent_id = 0 } = req.body;
    const hasError = await hasExpireError(res, token, null, true);
    if (!hasError) {
      await Category.create({
        name,
        parent_id: Number(parent_id),
      });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_CREATE",
        message: "category created",
      });
    } else {
      await hasExpireError(res, token, null);
    }
  } catch (e) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong, check inputs",
    });
  }
};
export const list = async (req, res) => {
  try {
    const { token } = req.body;
    const hasError = await hasExpireError(res, token, null, true);
    if (!hasError) {
      const categories = await Category.findAll({
        attributes: ["id", "parent_id", "name"],
      });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_LIST",
        message: " list of categories",
        details: {
          count: _.size(categories),
          list: categories,
        },
      });
    } else {
      await hasExpireError(res, token, null);
    }
  } catch (e) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
export const single = async (req, res) => {
  try {
    const { token, id = 0, name = "" } = req.body;
    const hasError = await hasExpireError(res, token, null, true);
    if (!hasError) {
      const categories = await Category.findOne({
        where: { [Op.or]: { id, name: { [Op.like]: `%${name}%` } } },
        attributes: ["id", "parent_id", "name"],
      });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_SINGLE",
        message: "single category",
        details: {
          single: categories,
        },
      });
    } else {
      await hasExpireError(res, token, null);
    }
  } catch (e) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
export const update = async (req, res) => {
  try {
    const { token, id, name, parent_id = 0 } = req.body;
    const hasError = await hasExpireError(res, token, null, true);
    if (!hasError) {
      let query = {};
      if (!_.isEmpty(name) && !_.isEmpty(parent_id)) {
        query = { name, parent_id };
      }
      if (_.isEmpty(name) && !_.isEmpty(parent_id)) {
        query = { parent_id };
      }
      if (!_.isEmpty(name) && _.isEmpty(parent_id)) {
        query = { name };
      }
      await Category.update(query, { where: { id } });
      const categoryRecord = await Category.findOne({
        where: { id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_SINGLE",
        message: "single category",
        details: {
          single: categoryRecord,
        },
      });
    } else {
      await hasExpireError(res, token, null);
    }
  } catch (e) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
export const remove = async (req, res) => {
  //deactivate
  try {
    const { token, id } = req.body;
    const hasError = await hasExpireError(res, token, null, true);
    if (!hasError) {
      await Category.destroy({ where: { id } });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_DELETE",
        message: `id ${id} deleted`,
      });
    } else {
      await hasExpireError(res, token, null);
    }
  } catch (e) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
