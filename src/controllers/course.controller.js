const httpStatus = require('http-status');
const db = require("../models");
const models = db.models;
const User = models.user;
const AccessToken = models.accessToken;
const _ = require('lodash');
const Op = db.Sequelize.Op;
const moment = require('moment-timezone');
const crypto = require('crypto');
const {hasExpireError} = require('../utils/isExpired');
const {response} = require('../utils/response')
const randomNumber = require("random-number-csprng");
_.isFalse = (x) => _.includes(["false", false], x);
_.isTrue = (x) => _.includes(["true", true], x);


exports.create = async (req, res) => {
    try {
        const {token, title, description, language, sale, order, featured_order, featured, is_active} = req.body
        await hasExpireError(res,token)
    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
}
exports.list = async (req, res) => {
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
