import db from "../../../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import crypto from "crypto";
//const EmailService = require('../services/email.service');
import randomNumber from "random-number-csprng";
import bcrypt from "bcrypt";

const isTrue = (x) => _.includes(["true", true], x);
const models = db.models;
const User = models.user;
const AccessToken = models.accessToken;
const PhoneNumberVerification = models.phoneNumberVerification;
const EmailProviderVerification = models.emailProviderVerification;

/**
 * send an email.
 * @private
 */
export const generateToken = async (entity = 1, duration = "day") => {
  let tokenObject = {};
  const expires = await moment().add(entity, duration).utc().format();
  tokenObject.token = await String(crypto.randomBytes(30).toString("hex"));
  tokenObject.expires = await String(expires);
  return tokenObject;
};

export const encryptPassword = async (plainText) => {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(plainText, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
};
export const checkPassword = async (storedPass, plainText) => {
  const areEqual = await new Promise((resolve, reject) => {
    bcrypt.compare(plainText, storedPass, function (err, result) {
      resolve(result);
    });
  });
  return areEqual;
};
export const generateCode = async () => {
  let codeObject = {};
  const expire_date = await moment().add(10, "minutes").utc().format();
  const number = await randomNumber(10000, 99999);
  codeObject.code = String(number);
  codeObject.expires = String(expire_date);
  return codeObject;
};

const sendMail = async ({ email, code }) => {
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
};

export const sendSms = async ({ phone_number, code, isForget = false }) => {
  return true;
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
export const sendCodeMiddleware = async ({ code, userId }) => {
  const userInfo = await User.findOne({ where: { id: userId } });
  // if (isTrue(with_email)) {
  //   await sendMail(userInfo["dataValues"], code);
  // } else {
  _.isEmpty(await PhoneNumberVerification.findOne({ where: { userId } })) &&
    (await PhoneNumberVerification.create({
      userId,
      verified: false,
    }));
  await sendSms(userInfo["dataValues"], code);
  // }
};
export const verifyCodeMiddleware = async (data) => {
  const { code, userId } = data;
  const { with_email } = await User.findOne({ where: { id: userId } });

  if (isTrue(with_email)) {
    _.isEmpty(await EmailProviderVerification.findOne({ where: { userId } }))
      ? await EmailProviderVerification.create({
          userId,
          verified: true,
        })
      : await EmailProviderVerification.update(
          { verified: true },
          { where: { userId } }
        );
  } else {
    _.isEmpty(await PhoneNumberVerification.findOne({ where: { userId } }))
      ? await PhoneNumberVerification.create({
          userId,
          verified: true,
        })
      : await PhoneNumberVerification.update(
          { verified: true },
          { where: { userId } }
        );
  }
};

export const checkUserPermission = async (req) => {
  const url = req.originalUrl;
  const token = req.cookies.access_token;
  const tokenRecord = await AccessToken.findOne({ where: { token } });
  const foundUser = await User.findOne({
    where: { id: tokenRecord.dataValues.userId },
  });
  const role = foundUser.dataValues.role;
  const course_author = ["owner", "admin", "author"];
  const category_roles = ["owner", "admin"];
  const user_modify_roles = ["owner", "admin", "owner", "manager"];
  const hasUserId = req.body.userId;
  if (!!url) {
    switch (url) {
      //course
      case "/v1/course/create": {
        return _.includes(course_author, role);
      }
      case "/v1/course/update": {
        return _.includes(course_author, role);
      }
      case "/v1/course/delete": {
        return _.includes(course_author, role);
      }
      //category
      case "/v1/category/create": {
        return _.includes(category_roles, role);
      }
      case "/v1/category/update": {
        return _.includes(category_roles, role);
      }
      case "/v1/category/delete": {
        return _.includes(category_roles, role);
      }
      //user
      case "/v1/user/update": {
        if (req.body.role === "ordinary" || req.body.role === "author")
          return _.includes(user_modify_roles, role);
        if (req.body.role === "admin")
          return _.includes(["owner", "manager"], role);
        if (req.body.role === "manager" || req.body.role === "owner")
          return _.includes(["owner"], role);
        else false;
      }
      case "/v1/user/search": {
        return _.includes(category_roles, role);
      }
      default: {
        return true;
      }
    }
  }
};
export const getTokenOwnerId = async (req) => {
  const token = req.cookies.access_token;
  const tokenData = await AccessToken.findOne({ where: { token } });
  if (tokenData) {
    if (tokenData?.dataValues) return tokenData.dataValues.userId;
    else
      throw {
        message: "not found user with this token",
        name: "invalid token",
      };
  }
};
export const getTokenOwnerRole = async (req) => {
  const userId = await getTokenOwnerId(req);
  const roleData = await User.findOne({ where: { id: userId } });
  if (roleData) {
    if (roleData?.dataValues) return roleData.dataValues.role;
    else
      throw {
        message: "not found user with this token",
        name: "invalid token",
      };
  }
};
