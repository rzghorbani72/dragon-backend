import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
import { exceptionEncountered, response } from "../utils/response.js";
const isFalse = (x) => _.includes(["false", false], x);
const isTrue = (x) => _.includes(["true", true], x);

const Op = db.Sequelize.Op;
const models = db.models;
const Category = models.category;

export const create = async (req, res) => {
  try {
    const { name, parent_id = 0 } = req.body;
    await Category.create({
      name,
      parent_id: Number(parent_id),
    });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "CATEGORY_CREATE",
      message: "category created",
    });
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const list = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "parent_id", "name", "type"],
    });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "CATEGORY_LIST",
      message: "list of categories",
      details: {
        count: _.size(categories),
        list: categories,
      },
    });
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const single = async (req, res) => {
  try {
    const { id = 0, name = "" } = req.body;
    const categories = await Category.findOne({
      where: { [Op.or]: { id, name: { [Op.like]: `%${name}%` } } },
      attributes: ["id", "parent_id", "name", "type"],
    });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "CATEGORY_SINGLE",
      message: "single category",
      details: {
        single: categories,
      },
    });
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const update = async (req, res) => {
  try {
    const { id, name, parent_id = 0 } = req.body;
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
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.body;
    await Category.destroy({ where: { id } });
    return response(res, {
      statusCode: httpStatus.OK,
      name: "CATEGORY_DELETE",
      message: `id ${id} deleted`,
    });
  } catch (e) {
    return exceptionEncountered(res);
  }
};
