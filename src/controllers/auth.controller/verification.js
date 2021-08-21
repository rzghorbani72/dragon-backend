import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../../utils/isExpired.js";
import { response } from "../../utils/response.js";
import { generateToken, verifyCodeMiddleware } from "./helpers.js";

const models = db.models;
const User = models.user;
const AccessToken = models.accessToken;
const Op = db.Sequelize.Op;

export default async (req, res, next) => {
  try {
    const { token, code } = req.body;
    const hasError = await hasExpireError(res, token, code, true);
    if (!hasError) {
      const codeRecord = await AccessToken.findOne({ where: { code } });
      if (!_.isEmpty(codeRecord)) {
        const tokenInfo = await generateToken();
        await verifyCodeMiddleware(codeRecord["dataValues"]);
        await AccessToken.update(
          {
            token: tokenInfo.token,
            token_expire: tokenInfo.expires,
            verified: true,
          },
          { where: { code } }
        );
        await User.update(
          {
            phone_number_verified: true,
          },
          { where: { id: codeRecord["dataValues"]["userId"] } }
        );
        await AccessToken.destroy({
          where: {
            userId: codeRecord["dataValues"]["userId"],
            [Op.or]: {
              token_expire: { [Op.lt]: new Date() },
              verified: false,
            },
          },
        });

        return response(res, {
          statusCode: httpStatus.ACCEPTED,
          name: "VERIFIED",
          message: "verified",
          details: { token: tokenInfo.token },
        });
      }
    } else {
      await hasExpireError(res, token, code);
    }
  } catch (e) {
    console.log(e);
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
