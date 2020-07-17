const httpStatus = require('http-status');
const db = require("../models");
const models = db.models;
const User = models.user;
const Role = models.role;
const PhoneNumberVerification = models.phoneNumberVerification;
const EmailProviderVerification = models.emailProviderVerification;
const AccessToken = models.accessToken;
const _ = require('lodash');
const Op = db.Sequelize.Op;
const moment = require('moment-timezone');
const crypto = require('crypto');
//const EmailService = require('../services/email.service');
const {response} = require('../utils/response')
const randomNumber = require("random-number-csprng");
_.isFalse = (x) => _.includes(["false", false], x);
_.isTrue = (x) => _.includes(["true", true], x);
/**
 * send an email.
 * @private
 */
const generateToken = async (entity = 1, duration = 'day') => {
    let tokenObject = {};
    const expires = await moment().add(entity, duration).utc().format()
    tokenObject.token = await String(crypto.randomBytes(30).toString('hex'));
    tokenObject.expires = await String(expires);
    return tokenObject;
}
const generateCode = async () => {
    let codeObject = {};
    const expire_date = await moment().add(10, 'minutes').utc().format()
    const number = await randomNumber(10000, 99999)
    codeObject.code = await String(number);
    codeObject.expires = await String(expire_date);
    return codeObject;
}

const sendMail = async (user, code) => {
    const createObj = {
        userId: user.id,
        token: null,
        code: code
    }
    return true;
    //return response(res,{statusCode:httpStatus.OK,name:'SENT_CODE_TO_EMAIL',message:'send by mailer',details:{phone_number: user.phone_number,}})
    // let nameAndFamily;
    // if (user.name && (user.name.first || user.name.last)) { nameAndFamily = `${user.name.first} ${user.name.last}`; } else { nameAndFamily = user.email; }
    // EmailService.sendByMailJetByTemplate({
    //     fromEmail: 'social@dragon.app',
    //     fromName: 'dragon',
    //     toName: user.email,
    //     toEmail: user.email,
    //     subject: 'Welcome to dragon!',
    //     templateId: 479966,
    //     variables: {
    //         firstname: nameAndFamily,
    //         email_to: user.email,
    //         confirmation_link: `${apiAddress}confirmation/${token}`,
    //     },
    // });
}

const sendSms = async (user, code) => {
    return true;
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
const sendCodeMiddleware = async ({code, userId, with_email}) => {
    const userInfo = await User.findOne({where: {id: userId}});
    if (_.isTrue(with_email)) {
        await sendMail(userInfo['dataValues'], code)
    } else {
        const userPhoneInfoExists = !_.isEmpty(await PhoneNumberVerification.findOne({
            where: {
                userId,
                verified: false
            }
        }));
        if (!userPhoneInfoExists) {
            await PhoneNumberVerification.create({code, userId})
        }
        await sendSms(userInfo['dataValues'], code)
    }
}
const verifyCodeMiddleware = async (data) => {

    const {code, userId} = data
    const {with_email} = await User.findOne({where: {id:userId}})

    if (_.isTrue(with_email)) {
        const userEmailInfoExists = !_.isEmpty(await EmailProviderVerification.findOne({
            where: {
                userId,
                verified: false
            }
        }));
        if (!userEmailInfoExists) {
            await EmailProviderVerification.create({code, userId})
        }
        return true;
    } else {
        const userPhoneInfoExists = !_.isEmpty(await PhoneNumberVerification.findOne({
            where: {
                userId,
                verified: false
            }
        }));
        if (!userPhoneInfoExists) {
            await PhoneNumberVerification.create({code, userId})
        }
        return true;
    }
}
exports.authenticate = async (req, res, next) => {
    try {
        const {phone_number, email, identity, with_email} = req.body;
        const condition = _.isTrue(with_email) ? {email} : {phone_number};
        const userExists = (await User.count({where: condition})) !== 0
        const {id} = userExists ? await User.findOne({where: condition}) :
            await (User.create(condition).then(data => {
                return data['dataValues']
            }));
        await Role.create({userId: id, user_type: 'ordinary'});
        const codeInfo = await generateCode();
        const tokenInfo = await generateToken();
        const code_json = {
            userId: id,
            with_email,
            code: codeInfo.code,
            token: tokenInfo.token,
            code_expire: codeInfo.expires,
            token_expire: tokenInfo.expires
        }
        await AccessToken.create(code_json);
        await sendCodeMiddleware(code_json);
        return response(res, {
            statusCode: httpStatus.CREATED, name: 'USER_CREATED', message: 'user created', details: {
                code: codeInfo.code,
                token: tokenInfo.token
            }
        })
    } catch (err) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
};

exports.verification = async (req, res, next) => {
    try {
        const {token, code} = req.body;
        const tokenExists = (await AccessToken.count({where: {token}})) !== 0;
        if (!tokenExists) {
            return response(res, {
                statusCode: httpStatus.UNAUTHORIZED,
                name: 'TOKEN_NOT_FOUND',
                message: 'Token Not Found',
            })
        }
        const codeRecord = await AccessToken.findOne({where: {token, code}});
        if (!_.isEmpty(codeRecord)) {
            if (moment(codeRecord['dataValues']['code_expire']).isBefore()) {
                return response(res, {
                    statusCode: httpStatus.FORBIDDEN,
                    name: 'EXPIRED',
                    message: 'expired code',
                })
            }
            const tokenInfo = await generateToken('3', 'months');
            await verifyCodeMiddleware(codeRecord['dataValues']);
            await AccessToken.update({
                token: tokenInfo.token,
                token_expire: tokenInfo.expires,
                verified: true
            }, {where: {token, code}});
            await AccessToken.destroy({
                where: {
                    userId: codeRecord['dataValues']['userId'],
                    [Op.or]: {
                        token_expire: {[Op.lt]: new Date()},
                        verified: false
                    }
                }
            });
            return response(res, {
                statusCode: httpStatus.ACCEPTED,
                name: 'VERIFIED',
                message: 'verified',
                details: {token: tokenInfo.token}
            })
        }
        return response(res, {statusCode: httpStatus.NOT_FOUND, name: 'CODE_NOT_FOUND', message: 'wrong code'})
    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
}
exports.retry = async (req, res, next) => {
    try {
        const {token} = req.body;
        const tokenRecord = await AccessToken.findOne({where: {token}});
        if (!_.isEmpty(tokenRecord)) {
            if (moment(tokenRecord['dataValues']['token_expire']).isBefore()) {
                return response(res, {
                    statusCode: httpStatus.FORBIDDEN,
                    name: 'EXPIRED',
                    message: 'expired token',
                })
            }
            const codeInfo = await generateCode();
            const foundUserAccessToken = await AccessToken.findOne({where: {token}});
            const code_json = {
                userId: foundUserAccessToken['dataValues']['userId'],
                code: codeInfo.code,
                token: token,
                retry: true,
                with_email: foundUserAccessToken['dataValues']['with_email'],
                code_expire: codeInfo.expires,
                token_expire: foundUserAccessToken['dataValues']['expires']
            }
            await AccessToken.create(code_json);
            await sendCodeMiddleware(code_json);
            return response(res, {
                statusCode: httpStatus.CREATED,
                name: 'CODE_SENT',
                message: 'code sent',
                details: {token}
            })
        }
        return response(res, {statusCode: httpStatus.UNAUTHORIZED, name: 'UNAUTHORIZED', message: 'Token Not Found'})
    } catch (e) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
}
/**
 * @public
 */
exports.logout = async (req, res, next) => {
    try {
        const {token} = req.body;
        const tokenRecord = await AccessToken.findOne({where: {token}});
        await AccessToken.destroy({
            where: {
                userId: tokenRecord['dataValues']['userId'],
                [Op.or]: {
                    token_expire: {[Op.lt]: new Date()},
                    verified: false
                }
            }
        })
        await AccessToken.update({
            token_expire: moment().utc().format()
        }, {where: {token}});
        return response(res, {name: 'LOG_OUT', statusCode: httpStatus.OK, message: 'logged out and token destroyed'})
    } catch (error) {
        return response(res, {
            statusCode: httpStatus.EXPECTATION_FAILED,
            name: 'EXPECTATION_FAILED',
            message: 'something went wrong'
        })
    }
};
