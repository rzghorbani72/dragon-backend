import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../../utils/response.js";
import {
  generateToken,
  generateCode,
  sendCodeMiddleware,
  checkPassword,
  encryptPassword,
} from "../../utils/controllerHelpers/auth/helpers.js";
import { hasExpireError } from "../../utils/isExpired.js";
import { token } from "morgan";

const models = db.models;
const User = models.user;
const Role = models.role;
const AccessToken = models.accessToken;

export const login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    //const codeInfo = await generateCode();
    const tokenInfo = await generateToken();

    const foundUser = await User.findOne({
      where: { phone_number },
    });

    //login with phone and password
    if (!_.isEmpty(foundUser?.dataValues)) {
      if (await checkPassword(foundUser.password, password)) {
        const { id } = foundUser;
        await Role.findOrCreate({
          where: { userId: id, user_type: "ordinary" },
          defaults: { userId: id, user_type: "ordinary" },
        });
        await AccessToken.create({
          token: tokenInfo.token,
          token_expire: tokenInfo.expires,
        }).then((result) => {
          if (!_.isEmpty(result.dataValues))
            return response(res, {
              statusCode: httpStatus.OK,
              name: "SUCCESSFUL_LOGIN",
              details: { token: tokenInfo.token },
              cookieObject: {
                key: "access_token",
                value: tokenInfo.token,
              },
            });
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
    const tokenInfo = await generateToken();

    const userPendingExists = await User.findOne({
      where: { phone_number },
    });

    //register with phone and password
    if (!_.isEmpty(userPendingExists?.dataValues)) {
      if (!userPendingExists.phone_number_verified) {
        const unValidCode = await hasExpireError({ code });
        if (unValidCode) {
          return response(res, unValidCode);
        }
      }

      await User.update(
        {
          password: await encryptPassword(password),
          phone_number_verified: true,
        },
        { where: { phone_number } }
      ).then(async (result) => {
        // await AccessToken.delete({ where: { code } });

        const { id } = userPendingExists.dataValues;
        await Role.findOrCreate({
          where: { userId: id, user_type: "ordinary" },
          defaults: { userId: id, user_type: "ordinary" },
        });

        await AccessToken.create({
          token: tokenInfo.token,
          token_expire: tokenInfo.expires,
        }).then((result) => {
          if (!_.isEmpty(result.dataValues))
            return response(res, {
              statusCode: httpStatus.OK,
              name: "SUCCESSFUL_SIGNUP",
              details: { token: tokenInfo.token },
              cookieObject: {
                key: "access_token",
                value: tokenInfo.token,
              },
            });
        });
      });
    } else {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "INVALID_REQUEST",
      });
    }
    //role
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
