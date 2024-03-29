import db from "../../../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import crypto from "crypto";
const algorithm = "aes-256-cbc";
// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);
// secret key generate 32 bytes of random data
const Securitykey = "bQeThWmZq4t7w!z%C*F-JaNdRfUjXn2r";

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
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const encryptedData =
    encrypted.toString("hex") + "." + initVector.toString("hex");
  return encryptedData;
};

const decrypt = (hash) => {
  const initVector = hash.split(".")[1];
  const content = hash.split(".")[0];
  const decipher = crypto.createDecipheriv(
    algorithm,
    Securitykey,
    Buffer.from(initVector, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

export const generateToken = async (entity = 1, duration = "day") => {
  let tokenObject = {};
  const expires = await moment().add(entity, duration).utc().format();
  tokenObject.token = await String(crypto.randomBytes(30).toString("hex"));
  tokenObject.expires = await String(expires);
  return tokenObject;
};
export const generateUserToken = async (user, entity = 1, duration = "day") => {
  const expires = await moment().add(entity, duration).utc().format();
  const data = {
    id: user.id,
    phone_number: user.phone_number,
    role: user.role,
    expires: String(expires),
  };
  let encryptedData = encrypt(JSON.stringify(data));
  return { token: encryptedData, expires };
};
export const decodeUserToken = (token) => {
  return decrypt(token);
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

export const sendSms = async ({ phone_number, code, isForget = false }) => {
  return true;
};

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
  await sendSms({ phone_number: userInfo["dataValues"]["phone_number"], code });
  // }
};
export const verifyCodeMiddleware = async (data) => {
  const { code, userId, phone_number, email } = data;
  const foundCode = await AccessToken.findOne({
    row: true,
    where: { code, userId },
  });
  if (foundCode) {
    if (phone_number) {
      await User.update(
        { phone_number_verified: true },
        { where: { code, phone_number } }
      );
    } else if (email) {
      await User.update({ email_verified: true }, { where: { code, email } });
    }
    return { validated: true };
  } else {
    return { validated: false };
  }
};

export const checkUserPermission = async (req, { userId }) => {
  const url = req.originalUrl;
  const role = await getTokenOwnerRole(req);
  const OWNER_ADMIN_AUTHOR = ["owner", "admin", "author"];
  const OWNER_ADMIN = ["owner", "admin"];
  const user_modify_roles = ["owner", "admin", "owner"];
  const hasUserId = req.body.userId;
  if (!!url) {
    switch (url) {
      //course
      case "/v1/course/create": {
        return _.includes(OWNER_ADMIN_AUTHOR, role);
      }
      case "/v1/course/update": {
        return _.includes(OWNER_ADMIN_AUTHOR, role);
      }
      case "/v1/course/delete": {
        return _.includes(OWNER_ADMIN_AUTHOR, role);
      }
      //category
      case "/v1/category/create": {
        return _.includes(OWNER_ADMIN, role);
      }
      case "/v1/category/update": {
        return _.includes(OWNER_ADMIN, role);
      }
      case "/v1/category/delete": {
        return _.includes(OWNER_ADMIN, role);
      }
      //file
      case "/v1/file/upload/video": {
        return _.includes(OWNER_ADMIN, role);
      }
      case "/v1/file/upload/image": {
        return _.includes(OWNER_ADMIN, role);
      }
      //user
      case "/v1/user/update": {
        if (req.body.role === "ordinary" || req.body.role === "author")
          return _.includes(user_modify_roles, role);
        if (req.body.role === "admin")
          return _.includes(["owner"], role);
        if (req.body.role === "owner")
          return _.includes(["owner"], role);
        else false;
      }
      case "/v1/user/search": {
        return _.includes(OWNER_ADMIN, role);
      }
      default: {
        return true;
      }
    }
  }
};
export const getTokenOwnerId = (req) => {
  const access_token = req.cookies.access_token;
  const userData = JSON.parse(decodeUserToken(access_token));
  if (_.has(userData, "id")) return userData.id;
  else
    throw {
      message: "not found user with this token",
      name: "invalid token",
    };
};
export const getTokenOwnerRole = (req) => {
  const access_token = req.cookies.access_token;
  const userData = JSON.parse(decodeUserToken(access_token));
  if (userData.role) return userData.role;
  else
    throw {
      message: "not found user with this token",
      name: "invalid token",
    };
};
