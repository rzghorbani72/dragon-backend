import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { exceptionEncountered, response } from "../../utils/response.js";
import {
  generateUserToken,
  checkPassword,
  sendCodeMiddleware,
  encryptPassword,
} from "../../utils/controllerHelpers/auth/helpers.js";

const models = db.models;
const User = models.user;
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
    exceptionEncountered(res, err);
  }
};

export const updateUserPassword = async (condition, newPass, res) => {
  await User.update(
    {
      password: newPass,
    },
    { where: condition }
  ).then((data) => {
    return data["dataValues"];
  });
  await User.findOne({ where: condition }).then(async (result) => {
    const { id } = result.dataValues;
    const tokenInfo = await generateUserToken(result.dataValues);
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
  });
};
export const createUserWithPassword = async (condition, res) => {
  condition.full_name = condition.phone_number;
  const foundUser = await User.create(condition).then(
    (data) => data["dataValues"]
  );
  const { id } = foundUser;
  const tokenInfo = await generateUserToken(foundUser);

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
