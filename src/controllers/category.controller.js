import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
import { exceptionEncountered, response } from "../utils/response.js";
import courseCategoryModel from "../models/courseCategory.model.js";

const Op = db.Sequelize.Op;
const models = db.models;
const Category = models.category;
const Course = models.course;

export const create = async (req, res) => {
  try {
    const { name, parent_id = 0, type = "category" } = req.body;

    const hasAtLeastOneParent =
      parent_id > 0
        ? await Category.findOne({
            where: { id: parent_id },
          })
        : { dataValues: "true" };

    if (!_.isEmpty(hasAtLeastOneParent?.dataValues)) {
      await Category.create({
        name,
        parent_id,
        type,
      }).then((result) => {
        if (!_.isEmpty(result.dataValues)) {
          const { id, name, type, parent_id } = result.dataValues;
          return response(res, {
            statusCode: httpStatus.CREATED,
            name: "CATEGORY_CREATE",
            message: "category created",
            details: { id, name, parent_id, type },
          });
        }
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "PARENT_CATEGORY_NOTFOUND",
      });
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const list = async (req, res) => {
  try {
    if (_.isEmpty(req.body.hasCourse)) {
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
    } else {
      const categories = await Category.findAll({
        attributes: ["id", "parent_id", "name", "type"],
        include: [
          {
            model: Course,
            as: "course",
          },
        ],
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
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const single = async (req, res) => {
  try {
    const { id } = req.params;
    // const category = await Category.findOne({
    //   where: { [Op.or]: { id, name: { [Op.like]: `%${name}%` } } },
    //   attributes: ["id", "parent_id", "name", "type"],
    // });
    const category = await Category.findOne({
      where: { id },
    });
    if (!_.isEmpty(category?.dataValues)) {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_SINGLE",
        message: "single category",
        details: category ? category.dataValues : category,
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "CATEGORY_NOTFOUND",
        message: "single category not found",
      });
    }
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;
    if (_.isEmpty(name) && _.isEmpty(parent_id)) {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "BAD_REQUEST",
        message: "name or parentId or both are empty",
      });
    }
    const categoryRecord = await Category.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!_.isEmpty(categoryRecord?.dataValues)) {
      const query = { name, parent_id };
      _.isEmpty(name) && delete query.name;
      _.isEmpty(parent_id) && delete query.parent_id;

      if (_.has(query, "parent_id")) {
        const parentIsAvailable = await Category.findOne({
          where: { id: parent_id },
        });
        if (_.isEmpty(parentIsAvailable?.dataValues)) {
          return response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: "PARENT_CATEGORY_NOTFOUND",
          });
        }
      }
      await Category.update(query, { where: { id } });
      const modifiedCategory = await Category.findOne({ where: { id } });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_MODIFIED",
        message: `single category id=${id} modified`,
        details: modifiedCategory,
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "CATEGORY_NOTFOUND",
        message: "single category not found",
      });
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.destroy({ where: { id } }).then((result) => {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CATEGORY_DELETE",
        message: `id ${id} deleted`,
      });
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
