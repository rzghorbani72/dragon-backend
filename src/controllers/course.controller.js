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
const Image = models.image;
const Category = models.category;
const CourseCategory = models.courseCategory;
const isFalse = (x) => _.includes(["false", false], x);
const isTrue = (x) => _.includes(["true", true], x);

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
    const _useId = _.isEmpty(userId) ? await getTokenOwnerId(req) : userId;
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
      const foundImage = await Image.findOne({ where: { id: imageId } });
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
      authorId: _useId,
      imageId,
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
        statusCode: httpStatus.OK,
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
      title = null,
      sale = null,
      order = null, //created_at,updated_at,price(asc,desc),visit_count,
      featured_order = null,
      featured = null,
      is_active = null,
      category_id = null,
    } = req.body;
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const single = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      sale,
      order,
      featured_order,
      featured,
      is_active,
    } = req.body;
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const update = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      sale,
      order,
      featured_order,
      featured,
      is_active,
    } = req.body;
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const remove = async (req, res) => {
  //deactivate
  try {
    const {
      title,
      description,
      language,
      sale,
      order,
      featured_order,
      featured,
      is_active,
    } = req.body;
  } catch (e) {
    return exceptionEncountered(res);
  }
};
