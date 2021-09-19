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

    const createCodeAndSend = async (userInfo) => {
      if (userInfo) {
        const code_json = {
          userId: userInfo.id,
          code: codeInfo.code,
          token: null,
          code_expire: codeInfo.expires,
          token_expire: null,
          ipAddress:
            req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        };
        await AccessToken.create(code_json);
        await sendSms({ phone_number, code: codeInfo.code, isForget });
        return response(res, {
          statusCode: httpStatus.CREATED,
          name: "CODE_SENT",
          message: "code sent",
          details: { code: codeInfo.code },
        });
      }
    };

    const foundUser = await User.findOne({ where: { phone_number } });
    if (!_.isEmpty(foundUser?.dataValues)) {
      await createCodeAndSend(foundUser.dataValues);
    } else {
      await User.create({ phone_number, full_name: phone_number }).then(
        async (result) => {
          await createCodeAndSend(result.dataValues);
        }
      );
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const validateCode = await hasExpireError({ code });
    if (validateCode?.codeValidated !== true) {
      return response(res, validateCode);
    } else if (validateCode?.codeValidated === true) {
      await User.update(
        {
          phone_number_verified: true,
        },
        {
          where: { id: validateCode.userId },
        }
      )
        .then(async (userRecord) => {
          return response(res, {
            statusCode: httpStatus.OK,
            name: "CODE_VERIFIED",
            message: "code verified",
            details: { code },
          });
        })
        .catch((err) => {
          return exceptionEncountered(res, err);
        });
    } else {
      return response(res, {
        statusCode: httpStatus.OK,
        name: "INVALID_CODE",
        message: "invalid code",
      });
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
