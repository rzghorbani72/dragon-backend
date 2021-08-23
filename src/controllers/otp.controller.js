import httpStatus from "http-status";
import _ from "lodash";
import { exceptionEncountered, response } from "../utils/response.js";
import {
  generateCode,
  sendSms,
} from "../utils/controllerHelpers/auth/helpers.js";
import db from "../models/index.js";
import { hasExpireError } from "../utils/isExpired.js";

const models = db.models;
const AccessToken = models.accessToken;
const User = models.user;

export const sendCodeToPhone = async (req, res) => {
  try {
    const { phone_number, isForget = false } = req.body;

    const codeInfo = await generateCode();
    const code_json = {
      code: codeInfo.code,
      token: null,
      retry: true,
      code_expire: codeInfo.expires,
      token_expire: null,
      ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    };
    await AccessToken.create(code_json);
    await User.findOrCreate({
      where: { phone_number, phone_number_verified: false },
      defaults: { phone_number, phone_number_verified: false },
    });
    await sendSms({ phone_number, code: codeInfo.code, isForget });
    return response(res, {
      statusCode: httpStatus.CREATED,
      name: "CODE_SENT",
      message: "code sent",
      details: { code: codeInfo.code },
    });
  } catch (e) {
    return exceptionEncountered(res);
  }
};
export const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const unValidCode = await hasExpireError({ code });
    if (unValidCode) {
      return response(res, unValidCode);
    }
    const foundUserAccessToken = await AccessToken.findOne({
      where: { code },
    });

    if (foundUserAccessToken) {
      await User.update(
        { phone_number_verified: true },
        { where: { id: foundUserAccessToken.id } }
      );
      await AccessToken.delete({ where: { code } });
      return response(res, {
        statusCode: httpStatus.OK,
        name: "CODE_VERIFIED",
        message: "code verified",
        details: { code },
      });
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "CODE_NOTFOUND",
        message: "wrong code",
        details: {},
      });
    }
  } catch (e) {
    return exceptionEncountered(res);
  }
};
