import httpStatus from "http-status";
import db from "../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../utils/isExpired.js";
import { exceptionEncountered, response } from "../utils/response.js";
import { getTokenOwnerId } from "../utils/controllerHelpers/auth/helpers.js";

const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const models = db.models;
const Course = models.course;
const File = models.file;
const Category = models.category;
const CourseCategory = models.courseCategory;

export const create = async (req, res) => {
  try {
    const {
      title,
      description,
      language = "fa",
      price,
      primary_price,
      order = 0,
      featured_order = 0,
      featured = false,
      is_active = false,
      category_ids,
      userId,
      imageId,
    } = req.body;

    const category_ids_array = category_ids.split(",");
    const _userId = _.isEmpty(userId) ? await getTokenOwnerId(req) : userId;
    await category_ids_array.map(async (catId) => {
      const foundCat = await Category.findOne({ where: { id: catId } });
      if (!foundCat) {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "CATEGORY_NOTFOUND",
          message: `categoryId ${catId} not found!`,
        });
      }
    });
    if (imageId) {
      const foundImage = await File.findOne({
        where: { uid: imageId, type: "image" },
      });
      if (!foundImage) {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "IMAGE_NOTFOUND",
          message: `imageId ${imageId} not found!`,
        });
      }
    }

    await Course.create({
      title,
      description,
      language,
      price,
      primary_price,
      order: Number(order),
      featured,
      featured_order: Number(featured_order),
      is_active,
      authorId: _userId,
      fileUid: imageId,
    }).then(async (data) => {
      const { id } = data.dataValues;

      data.categories = category_ids_array;

      await category_ids_array.map(async (catId) => {
        await CourseCategory.findOrCreate({
          where: {
            categoryId: Number(catId),
            courseId: Number(id),
          },
          defaults: {
            categoryId: Number(catId),
            courseId: Number(id),
          },
        });
      });
      await response(res, {
        statusCode: httpStatus.CREATED,
        name: "COURSE_CREATE",
        message: "course created",
        details: {
          ...data.dataValues,
          category_ids: JSON.stringify(
            category_ids_array.map((item) => (item = Number(item)))
          ),
        },
      });
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};

export const list = async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 20,
      order = "updatedAt", //createdAt,updatedAt,price,visit_count,featured_order
      orderBy = "DESC", //ASC,DESC
      is_active = null,
      categoryId = null,
    } = req.body;
    const whereOptions = {};
    const orderOptions = [];
    const includeOptions = [];
    if (!_.isEmpty(order)) {
      orderOptions[0] = [order, orderBy];
    }
    if (!_.isNull(is_active)) {
      whereOptions.is_active = is_active;
    }
    if (!_.isNull(categoryId)) {
      //whereOptions["$category.id$"] = { [Op.eq]: categoryId };
      includeOptions[0] = {
        model: Category,
        as: "category",
        // attributes: ["id", "name", "nameKh"],
        where: { id: categoryId },
        // through: { where: { categoryId } },
      };
    }
    await Course.findAndCountAll({
      row: true,
      where: whereOptions,
      include: includeOptions,
      order: orderOptions,
      limit,
      offset,
    }).then((result) => {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "OK",
        message: {
          limit: Number(limit),
          offset: Number(offset),
          total: result.count,
        },
        details: result,
      });
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const single = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findOne({
      where: { id },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    }).then((result) => {
      if (result) {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "OK",
          message: "successful",
          details: result?.dataValues,
        });
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: "course not found",
        });
      }
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const update = async (req, res) => {
  try {
    const {
      title,
      description,
      language = "fa",
      price,
      primary_price,
      order = 0,
      featured_order = 0,
      featured = false,
      is_active = false,
      category_ids,
      userId,
      imageId = null,
    } = req.body;
    const { id } = req.params;

    const category_ids_array = category_ids.split(",");
    const _userId = _.isEmpty(userId) ? await getTokenOwnerId(req) : userId;
    await category_ids_array.map(async (catId) => {
      const foundCat = await Category.findOne({ where: { id: catId } });
      if (!foundCat) {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "CATEGORY_NOTFOUND",
          message: `categoryId ${catId} not found!`,
        });
      }
    });
    if (imageId) {
      const foundImage = await File.findOne({
        where: { uid: imageId, type: "image" },
      });
      if (!foundImage) {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "IMAGE_NOTFOUND",
          message: `imageId ${imageId} not found!`,
        });
      }
    }

    await Course.findOne({
      row: true,
      where: { id },
    }).then(async (result) => {
      if (result) {
        await Course.update(
          {
            title,
            description,
            language,
            price,
            primary_price,
            order,
            featured_order,
            featured,
            is_active,
            authorId: _userId,
            category_ids,
            userId,
            fileUid: imageId,
          },
          {
            row: true,
            where: { id },
          }
        ).then((updateResult) => {
          if (updateResult) {
            return response(res, {
              statusCode: httpStatus.OK,
              name: "OK",
              message: "updated successfully",
            });
          } else {
            return response(res, {
              statusCode: httpStatus.FAILED_DEPENDENCY,
              name: "FAILED_DEPENDENCY",
              message: "updated failed",
            });
          }
        });
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOTFOUND",
          message: "course not found",
        });
      }
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await Course.destroy({ where: { id } }).then((result) => {
      if (result) {
        return response(res, {
          statusCode: httpStatus.OK,
          name: "CATEGORY_DELETE",
          message: `id ${id} deleted`,
        });
      } else {
        return response(res, {
          statusCode: httpStatus.FAILED_DEPENDENCY,
          name: "FAILED_DEPENDENCY",
        });
      }
    });
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
