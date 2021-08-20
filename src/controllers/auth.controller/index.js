import db from "../../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import crypto from "crypto";
//const EmailService = require('../services/email.service');
import randomNumber from "random-number-csprng";
import logOut from "./logout.js";
import retry from "./retry.js";
import verification from "./verification.js";
import authentication from "./authentication.js";

const models = db.models;
const User = models.user;
const PhoneNumberVerification = models.phoneNumberVerification;
const EmailProviderVerification = models.emailProviderVerification;
const isTrue = (x) => _.includes(["true", true], x);

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
export const generateCode = async () => {
  let codeObject = {};
  const expire_date = await moment().add(10, "minutes").utc().format();
  const number = await randomNumber(10000, 99999);
  codeObject.code = await String(number);
  codeObject.expires = await String(expire_date);
  return codeObject;
};

const sendMail = async (user, code) => {
  const createObj = {
    userId: user.id,
    token: null,
    code: code,
  };
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

const sendSms = async (user, code) => {
  return true;
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
export const sendCodeMiddleware = async ({ code, userId, with_email }) => {
  const userInfo = await User.findOne({ where: { id: userId } });
  if (isTrue(with_email)) {
    await sendMail(userInfo["dataValues"], code);
  } else {
    _.isEmpty(await PhoneNumberVerification.findOne({ where: { userId } })) &&
      (await PhoneNumberVerification.create({
        userId,
        verified: false,
      }));
    await sendSms(userInfo["dataValues"], code);
  }
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

export const authenticateController = async (req, res) =>
  await authentication(req, res);
export const verificationController = async (req, res) =>
  await verification(req, res);
export const retryController = async (req, res) => await retry(req, res);
export const logoutController = async (req, res) => await logOut(req, res);
