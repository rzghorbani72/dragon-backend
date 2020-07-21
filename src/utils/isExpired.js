const moment = require('moment-timezone');
const db = require("../models");
const httpStatus = require('http-status');
const models = db.models;
const _ = require('lodash');
const AccessToken = models.accessToken;
const {response} = require('../utils/response');
exports.hasExpireError = async (res, token = null, code = null, check = false) => {
    const tokenRecord = _.isEmpty(token) ? null : await AccessToken.findOne({where: {token: token}});
    const codeRecord = _.isEmpty(code) ? null : await AccessToken.findOne({where: {code: code}});

    if (_.isEmpty(tokenRecord)) {
        if (check) return true
        await response(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            name: 'UNAUTHORIZED',
            message: 'Token Not Found'
        })
    } else if (_.isEmpty(codeRecord) && !_.isEmpty(code)) {
        if (check) return true
        await response(res, {
            statusCode: httpStatus.NOT_FOUND,
            name: `CODE_NOT_FOUND`,
            message: `wrong code`
        })
    } else {
        const isBeforeToken = moment(tokenRecord['dataValues'][`token_expire`]).isBefore();
        const isBeforeCode = _.isEmpty(codeRecord) ? null : moment(codeRecord['dataValues'][`code_expire`]).isBefore();
        if (isBeforeToken) {
            if (check) return true
            await response(res, {
                statusCode: httpStatus.FORBIDDEN,
                name: 'EXPIRED',
                message: `expired token`,
            })
        } else if (isBeforeCode) {
            if (check) return true
            await response(res, {
                statusCode: httpStatus.FORBIDDEN,
                name: 'EXPIRED',
                message: `expired code`,
            })
        }
        if (check) return false
    }
}