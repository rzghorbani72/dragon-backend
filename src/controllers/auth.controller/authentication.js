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

const models = db.models;
const User = models.user;
const Role = models.role;
const AccessToken = models.accessToken;

export const login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    //const codeInfo = await generateCode();
    const tokenInfo = await generateToken();
    const conditionWithPhone = { phone_number };

    const userExistsWithPhone =
      (await User.count({
        where: { phone_number },
      })) !== 0;

    //login with phone and password
    if (userExistsWithPhone) {
      const userInfo = await User.findOne({
        where: { phone_number },
      });
      if (await checkPassword(userInfo.password, password)) {
        const { id } = userInfo;
        await Role.findOrCreate({
          where: { userId: id, user_type: "ordinary" },
          defaults: { userId: id, user_type: "ordinary" },
        });
        //successful login
        return response(res, {
          statusCode: httpStatus.OK,
          name: "SUCCESSFUL_LOGIN",
          details: { token: tokenInfo.token },
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
    return exceptionEncountered(res);
  }
};
export const register = async (req, res) => {
  try {
    const { phone_number, password, code } = req.body;
    const tokenInfo = await generateToken();

    const userPendingExists = await User.findOne({
      where: { phone_number, phone_number_verified: false },
    });

    //register with phone and password
    if (!_.isEmpty(userPendingExists) && _.isObject(userPendingExists)) {
      const unValidCode = await hasExpireError({ code });
      if (unValidCode) {
        return response(res, unValidCode);
      }
      await User.update(
        { password: encryptPassword(password), phone_number_verified: true },
        { where: phone_number }
      );
      await AccessToken.delete({ where: { code } });

      const { id } = userPendingExists;
      await Role.findOrCreate({
        where: { userId: id, user_type: "ordinary" },
        defaults: { userId: id, user_type: "ordinary" },
      });
      //successful login
      return response(res, {
        statusCode: httpStatus.OK,
        name: "SUCCESSFUL_LOGIN",
        details: { token: tokenInfo.token },
      });
    } else {
      return response(res, {
        statusCode: httpStatus.BAD_REQUEST,
        name: "INVALID_REQUEST",
      });
    }
    //role
  } catch (err) {
    return exceptionEncountered(res);
  }
};

export const checkUserState = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const foundUser = await User.findOne({ where: { phone_number } });
    if (!_.isEmpty(foundUser) && _.isObject(foundUser)) {
      if (foundUser.phone_number_verified) {
        await response(res, {
          statusCode: httpStatus.OK,
          name: "VERIFIED_USER_FOUND",
        });
      } else {
        await response(res, {
          statusCode: httpStatus.Ok,
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
