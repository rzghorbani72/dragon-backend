import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { response } from "../../utils/response.js";
import { generateToken, generateCode, sendCodeMiddleware } from "./index.js";

const models = db.models;
const User = models.user;
const Role = models.role;
const AccessToken = models.accessToken;
const isTrue = (x) => _.includes(["true", true], x);

export default async (req, res) => {
  try {
    const { phone_number, email, identity, with_email } = req.body;
    const condition = isTrue(with_email) ? { email } : { phone_number };
    const userExists = (await User.count({ where: condition })) !== 0;
    const { id } = userExists
      ? await User.findOne({ where: condition })
      : await User.create(condition).then((data) => {
          return data["dataValues"];
        });
    _.isEmpty(await Role.findOne({ where: { userId: id } })) &&
      (await Role.create({ userId: id, user_type: "ordinary" }));
    const codeInfo = await generateCode();
    const tokenInfo = await generateToken();
    const code_json = {
      userId: id,
      with_email,
      code: codeInfo.code,
      token: tokenInfo.token,
      code_expire: codeInfo.expires,
      token_expire: tokenInfo.expires,
    };
    await AccessToken.create(code_json);
    await sendCodeMiddleware(code_json);
    return response(res, {
      statusCode: httpStatus.CREATED,
      name: userExists ? "USER_AUTH" : "USER_CREATED",
      message: userExists ? "user refresh token updated" : "user created",
      details: {
        code: codeInfo.code,
        token: tokenInfo.token,
      },
    });
  } catch (err) {
    console.log(err);
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
