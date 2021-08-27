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
    } = req.body;

    const category_ids_array = category_ids.split(",");
    const _useId = _.isEmpty(userId) ? await getTokenOwnerId(req) : userId;

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
    }).then(async (data) => {
      const { id } = data.dataValues;

      data.categories = category_ids_array;

      Promise.resolve()
        .then(async () => {
          try {
            await category_ids_array.map(async (catId) => {
              const foundCat = await Category.findOne({ where: { id: catId } });
              if (foundCat) {
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
              }
            });
          } catch (err) {
            return exceptionEncountered(res, err);
          }
        })
        .then(async () => {
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
        })
        .catch((err) => {
          return exceptionEncountered(res, err);
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

    let inputs = [
      { title },
      { sale },
      { order },
      { featured_order },
      { featured },
      { is_active },
    ];
    let parsed_category_id;
    try {
      parsed_category_id = JSON.parse(category_id);
    } catch (e) {
      parsed_category_id = await CourseCategory.findAll({
        where: {},
        attributes: ["categoryId"],
      });
      parsed_category_id = _.map(parsed_category_id, "categoryId");
    }

    let category_ids = !_.isArray(parsed_category_id)
      ? _.isNumber(parsed_category_id)
        ? [parsed_category_id]
        : []
      : parsed_category_id;
    //let new_inputs = {};
    // await inputs.map(item => _.mapKeys(item, (value, key) => {
    //     !_.isNull(value) ? new_inputs[key] = (isTrue(value) || isFalse(value)) ? value : {[Op.like]: `%${value}%`} : ''
    // }));
    // let query = await _.isEmpty(new_inputs) ? {} : new_inputs.length > 1 ? {[Op.and]: new_inputs} : new_inputs;
    //     courses = await Course.findAll({
    //         where: query,
    //         offset,
    //         limit,
    //         attributes: {exclude: ['createdAt', 'updatedAt', 'destroyTime']}
    //     });
    //
    let like_query = [];
    await inputs.map((item) =>
      _.mapKeys(item, (value, key) => {
        let val = isTrue(value) || isFalse(value) ? value : `%${value}%`;
        let q = `${key} LIKE '${val}'`;
        !_.isNull(value) ? like_query.push(q) : "";
      })
    );
    let courses = await sequelize.query(
      "SELECT " +
        "course.*," +
        'course_category."categoryId" ' +
        "FROM " +
        "course " +
        'LEFT JOIN course_category ON course.ID = course_category."courseId" ' +
        'WHERE course_category."categoryId" IN (:catIds) AND ' +
        like_query.join(" AND ") +
        "LIMIT :limit OFFSET :offset",
      {
        replacements: { catIds: category_ids, limit, offset },
        type: sequelize.QueryTypes.FOREIGNKEYS,
      }
    );
    // courses.map(
    //   (course) =>
    //     delete course.destroyTime &&
    //     delete course.updatedAt &&
    //     delete course.createdAt
    // );
    return response(res, {
      statusCode: httpStatus.OK,
      name: "COURSE_LIST",
      message: "list of courses",
      details: {
        count: _.size(courses),
        list: courses,
      },
    });
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
