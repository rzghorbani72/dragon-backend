const httpStatus = require('http-status');
const db = require("../models");
const {QueryTypes} = db.sequelize;
const sequelize = db.sequelize;
const models = db.models;
const Course = models.course;
const CourseCategory = models.courseCategory;
const _ = require('lodash');
const Op = db.Sequelize.Op;
const {hasExpireError} = require('../utils/isExpired');
const {response} = require('../utils/response')
_.isFalse = (x) => _.includes(["false", false], x);
_.isTrue = (x) => _.includes(["true", true], x);


exports.create = async (req, res) => {
    try {
        const {token, title, description, language, sale, order, featured_order, featured, is_active, category_id} = req.body
        const hasError = await hasExpireError(res, token, null, true);
        if (!hasError) {
            const {id} = await (Course.create({
                title,
                description,
                language,
                sale,
                order: Number(order),
                featured,
                featured_order: Number(featured_order),
                is_active
            }).then(data => {
                console.log(data)
                return data['dataValues']
            }));

            await CourseCategory.create({categoryId: Number(category_id), courseId: id});

            return response(res, {
                statusCode: httpStatus.OK,
                name: 'COURSE_CREATE',
                message: 'course created'
            })
        } else {
            await hasExpireError(res, token, null);
        }
    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong, check inputs'
        })
    }
}
exports.list = async (req, res) => {
    try {
        const {token, offset = 0, limit = 20, title = null, description = null, language = null, sale = null, order = null, featured_order = null, featured = null, is_active = null, category_id = null} = req.body
        const hasError = await hasExpireError(res, token, null, true);
        if (!hasError) {
            let inputs = [{title: title}, {description: description}, {language: language}, {sale: sale}, {order: order}, {featured_order: featured_order}, {featured: featured}, {is_active: is_active}];
            let parsed_category_id;
            try {
                parsed_category_id = JSON.parse(category_id)
            } catch (e) {
                parsed_category_id = await CourseCategory.findAll({where: {}, attributes: ['categoryId']})
                parsed_category_id = _.map(parsed_category_id, 'categoryId');
            }
            let category_ids = !_.isArray(parsed_category_id) ? _.isNumber(parsed_category_id) ? [parsed_category_id] : [] : parsed_category_id;
            //let new_inputs = {};
            // await inputs.map(item => _.mapKeys(item, (value, key) => {
            //     !_.isNull(value) ? new_inputs[key] = (_.isTrue(value) || _.isFalse(value)) ? value : {[Op.like]: `%${value}%`} : ''
            // }));
            // let query = await _.isEmpty(new_inputs) ? {} : new_inputs.length > 1 ? {[Op.and]: new_inputs} : new_inputs;
            //     courses = await Course.findAll({
            //         where: query,
            //         offset,
            //         limit,
            //         attributes: {exclude: ['createdAt', 'updatedAt', 'destroyTime']}
            //     });
            //
            let like_query = []
            await inputs.map(item => _.mapKeys(item, (value, key) => {
                let val = (_.isTrue(value) || _.isFalse(value)) ? value : `%${value}%`
                let q = `${key} LIKE '${val}'`;
                !_.isNull(value) ? like_query.push(q) : '';
            }));
            let courses = await sequelize.query('SELECT ' +
                'course.*,' +
                'course_category."categoryId" ' +
                'FROM ' +
                'course ' +
                'LEFT JOIN course_category ON course.ID = course_category."courseId" ' +
                'WHERE course_category."categoryId" IN (:catIds) AND ' +
                like_query.join(' AND ') +
                'LIMIT :limit OFFSET :offset'
                , {
                    replacements: {catIds: category_ids, limit, offset},
                    type: sequelize.QueryTypes.FOREIGNKEYS
                });
            courses.map(course => delete course.destroyTime && delete course.updatedAt && delete course.createdAt);
            return response(res, {
                statusCode: httpStatus.OK,
                name: 'COURSE_LIST',
                message: 'list of courses',
                details: {
                    count: _.size(courses),
                    list: courses
                }
            });
        } else {
            await hasExpireError(res, token, null);
        }
    } catch (e) {
        console.log(e)
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
};
exports.single = async (req, res) => {
    try {
        const {token, title, description, language, sale, order, featured_order, featured, is_active} = req.body
    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
}
exports.update = async (req, res) => {
    try {
        const {token, title, description, language, sale, order, featured_order, featured, is_active} = req.body
    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
}
exports.remove = async (req, res) => {//deactivate
    try {
        const {token, title, description, language, sale, order, featured_order, featured, is_active} = req.body

    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
}
