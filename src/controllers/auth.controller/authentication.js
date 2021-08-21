import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { response } from "../../utils/response.js";
import {
  generateToken,
  generateCode,
  sendCodeMiddleware,
  checkPassword,
  encryptPassword,
} from "./helpers.js";

const models = db.models;
const User = models.user;
const Role = models.role;
const AccessToken = models.accessToken;

export default async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    const codeInfo = await generateCode();
    const tokenInfo = await generateToken();
    const conditionWithPhone = { phone_number };

    const userExistsWithPhone =
      (await User.count({
        where: conditionWithPhone,
      })) !== 0;

    if (userExistsWithPhone && password) {
      const userInfo = await User.findOne({
        where: conditionWithPhone,
      });
      if (await checkPassword(userInfo.password, password)) {
        const { id } = userInfo;
        _.isEmpty(await Role.findOne({ where: { userId: id } })) &&
          (await Role.create({ userId: id, user_type: "ordinary" }));
        await createOrUpdateUser({
          id,
          codeInfo,
          tokenInfo,
          hasPass: true,
          type: "update",
          res,
        });
      } else {
        return response(res, {
          statusCode: httpStatus.NOT_FOUND,
          name: "NOT_FOUND",
          message: "user not found",
        });
      }
    } else if (userExistsWithPhone && !password) {
      const userInfo = await User.findOne({
        where: conditionWithPhone,
      });
      const { id } = userInfo;
      await createOrUpdateUser({
        id,
        codeInfo,
        tokenInfo,
        hasPass: false,
        type: "update",
        res,
      });
    } else if (!userExistsWithPhone) {
      const userInfo = await User.create(conditionWithPhone);
      const { id } = userInfo;
      await createOrUpdateUser({
        id,
        codeInfo,
        tokenInfo,
        hasPass: false,
        type: "create",
        res,
      });
    }
    //role
  } catch (err) {
    console.log(err);
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};

const createOrUpdateUser = async ({
  id,
  codeInfo,
  tokenInfo,
  hasPass = false,
  type = "create",
  res,
}) => {
  _.isEmpty(await Role.findOne({ where: { userId: id } })) &&
    (await Role.create({ userId: id, user_type: "ordinary" }));
  const code_json = {
    userId: id,
    code: codeInfo.code,
    token: tokenInfo.token,
    code_expire: codeInfo.expires,
    token_expire: tokenInfo.expires,
  };
  await AccessToken.create(code_json);
  await sendCodeMiddleware(code_json);
  return response(res, {
    statusCode: httpStatus.CREATED,
    name: type === "create" ? "USER_CREATED" : "USER_UPDATED",
    message: type === "create" ? "new user token" : "user token updated",
    details: {
      code: hasPass ? null : codeInfo.code,
      token: tokenInfo.token,
    },
  });
};
