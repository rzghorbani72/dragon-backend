import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../../utils/response.js";
import geoIp from "geoip-lite";
import requestIp from "request-ip";
import getMAC from "getmac";

import {
  generateUserToken,
  checkPassword,
  encryptPassword,
} from "../../utils/controllerHelpers/auth/helpers.js";
import { hasExpireError } from "../../utils/isExpired.js";

const models = db.models;
const User = models.user;
const AccessToken = models.accessToken;

export const login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    //const codeInfo = await generateCode();

    const foundUser = await User.findOne({
      where: { phone_number },
    });

    //login with phone and password
    if (!_.isEmpty(foundUser?.dataValues)) {
      if (await checkPassword(foundUser.password, password)) {
        const tokenInfo = await generateUserToken(foundUser);
        const { id } = foundUser;
        await AccessToken.create({
          token: tokenInfo.token,
          token_expire: tokenInfo.expires,
          userId: id,
        }).then(async (result) => {
          if (result?.dataValues) {
            //const geoDetails = geoIp.lookup(requestIp.getClientIp(req));
            return response(res, {
              statusCode: httpStatus.OK,
              name: "SUCCESSFUL_LOGIN",
              details: { token: tokenInfo.token },
              cookieObject: {
                key: "access_token",
                value: tokenInfo.token,
              },
            });
          }
        });
      } else {
        return response(res, {
          statusCode: httpStatus.UNAUTHORIZED,
          name: "UNAUTHORIZED",
        });
      }
    } else {
      return response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "NOT_FOUND",
      });
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};
export const register = async (req, res) => {
  try {
    const { phone_number, password, code } = req.body;

    const userPendingExists = await User.findOne({
      where: { phone_number },
    });

    //register with phone and password
    if (!_.isEmpty(userPendingExists?.dataValues)) {
      if (!userPendingExists.phone_number_verified) {
        const inValidCode = await hasExpireError({ code });
        if (inValidCode.codeValidated !== true) {
          return response(res, inValidCode);
        }
      } else {
        await User.update(
          {
            password: await encryptPassword(password),
            phone_number_verified: true,
          },
          { where: { phone_number } }
        ).then(async (result) => {
          const { id } = userPendingExists.dataValues;
          const tokenInfo = await generateUserToken(userPendingExists);
          await AccessToken.create({
            token: tokenInfo.token,
            token_expire: tokenInfo.expires,
            userId: id,
          }).then(async (result) => {
            if (result.dataValues) {
              return response(res, {
                statusCode: httpStatus.OK,
                name: "SUCCESSFUL_SIGNUP",
                details: { token: tokenInfo.token },
                cookieObject: {
                  key: "access_token",
                  value: tokenInfo.token,
                },
              });
            }
          });
        });
      }
    } else {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "INVALID_REQUEST",
      });
    }
  } catch (err) {
    return exceptionEncountered(res, err);
  }
};

export const checkUserState = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const foundUser = await User.findOne({ where: { phone_number } });
    if (!_.isEmpty(foundUser?.dataValues)) {
      if (foundUser["dataValues"]["phone_number_verified"]) {
        await response(res, {
          statusCode: httpStatus.OK,
          name: "VERIFIED_USER_FOUND",
        });
      } else {
        await response(res, {
          statusCode: httpStatus.OK,
          name: "UNVERIFIED_USER_FOUND",
        });
      }
    } else {
      await response(res, {
        statusCode: httpStatus.NOT_FOUND,
        name: "USER_NOT_FOUND",
      });
    }
  } catch (err) {
    return exceptionEncountered(res);
  }
};
