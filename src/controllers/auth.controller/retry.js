import httpStatus from "http-status";
import _ from "lodash";
import { hasExpireError } from "../../utils/isExpired.js";
import { response } from "../../utils/response.js";
import { generateCode, sendCodeMiddleware } from "./helpers.js";
import db from "../../models/index.js";

const models = db.models;
const AccessToken = models.accessToken;

export default async (req, res) => {
  try {
    const { token } = req.body;
    const tokenRecord = await AccessToken.findOne({ where: { token } });
    await hasExpireError(res, token);
    if (!_.isEmpty(tokenRecord)) {
      const codeInfo = await generateCode();
      const foundUserAccessToken = await AccessToken.findOne({
        where: { token },
      });
      const code_json = {
        userId: foundUserAccessToken["dataValues"]["userId"],
        code: codeInfo.code,
        token: token,
        retry: true,
        with_email: foundUserAccessToken["dataValues"]["with_email"],
        code_expire: codeInfo.expires,
        token_expire: foundUserAccessToken["dataValues"]["expires"],
      };
      await AccessToken.create(code_json);
      await sendCodeMiddleware(code_json);
      return response(res, {
        statusCode: httpStatus.CREATED,
        name: "CODE_SENT",
        message: "code sent",
        details: { token },
      });
    }
  } catch (e) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
