import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { response } from "../../utils/response.js";
import {
  generateToken,
  checkPassword,
  sendCodeMiddleware,
  encryptPassword,
} from "../../utils/controllerHelpers/auth/helpers.js";

const models = db.models;
const User = models.user;
const Role = models.role;
const AccessToken = models.accessToken;

export default async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    const conditionWithPass = {
      phone_number,
      password: await encryptPassword(password),
    };
    const conditionWithPhone = { phone_number };
    const userExistsWithPhone =
      (await User.count({
        where: conditionWithPhone,
      })) !== 0;

    if (userExistsWithPhone) {
      const userInfo = await User.findOne({
        where: conditionWithPhone,
      });
      if (await checkPassword(userInfo.password, password)) {
        return response(res, {
          statusCode: httpStatus.FOUND,
          name: "USER_EXISTS",
          message: "user exists",
        });
      } else {
        await updateUserPassword(
          conditionWithPhone,
          conditionWithPass.password,
          res
        );
      }
    } else {
      await createUserWithPassword(conditionWithPass, res);
    }
  } catch (err) {
    console.log(err);
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};

export const updateUserPassword = async (condition, newPass, res) => {
  const tokenInfo = await generateToken();
  await User.update(
    {
      password: newPass,
    },
    { where: condition }
  ).then((data) => {
    return data["dataValues"];
  });
  const { id } = await User.findOne(condition);

  const code_json = {
    userId: id,
    code: null,
    token: tokenInfo.token,
    code_expire: null,
    token_expire: tokenInfo.expires,
  };
  await AccessToken.create(code_json);
  await sendCodeMiddleware(code_json);
  return response(res, {
    statusCode: httpStatus.OK,
    name: "USER_PASSWORD_UPDATED",
    message: "user password updated",
    details: {
      userId: id,
      token: tokenInfo.token,
    },
  });
};
export const createUserWithPassword = async (condition, res) => {
  const tokenInfo = await generateToken();
  debugger;
  condition.full_name = condition.phone_number;
  const { id } = await User.create(condition).then((data) => {
    return data["dataValues"];
  });

  await Role.create({ userId: id, user_type: "ordinary" });
  const code_json = {
    userId: id,
    code: null,
    token: tokenInfo.token,
    code_expire: null,
    token_expire: tokenInfo.expires,
  };
  await AccessToken.create(code_json);
  await sendCodeMiddleware(code_json);
  return response(res, {
    statusCode: httpStatus.CREATED,
    name: "USER_PASSWORD_CREATED",
    message: "user created with password",
    details: {
      userId: id,
      token: tokenInfo.token,
    },
  });
};
