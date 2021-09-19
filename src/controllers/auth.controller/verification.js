import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import { hasExpireError } from "../../utils/isExpired.js";
import { exceptionEncountered, response } from "../../utils/response.js";
import {
  generateUserToken,
  verifyCodeMiddleware,
} from "../../utils/controllerHelpers/auth/helpers.js";

const models = db.models;
const User = models.user;
const AccessToken = models.accessToken;
const Op = db.Sequelize.Op;

export default async (req, res, next) => {
  try {
    const { token, code, phone_number, email } = req.body;
    const tokenData = await hasExpireError({ token, code });
    if (
      !_.isEmpty(tokenData) &&
      _.isObject(tokenData) &&
      tokenData.tokenValidated &&
      tokenData.codeValidated &&
      _.has(tokenData, "id") &&
      _.has(tokenData, "phone_number") &&
      _.has(tokenData, "expires")
    ) {
      const { validated } = await verifyCodeMiddleware({
        userId: tokenData.id,
        phone_number,
        email,
        code,
      });
      if (validated) {
        await AccessToken.update(
          {
            token,
            token_expire: tokenData.expires,
            verified: true,
          },
          { where: { code } }
        );
        await AccessToken.destroy({
          where: {
            userId: tokenData.id,
            [Op.or]: {
              token_expire: { [Op.lt]: new Date() },
              verified: false,
            },
          },
        });
      }
      return response(res, {
        statusCode: httpStatus.ACCEPTED,
        name: "VERIFIED",
        message: "verified",
        details: { token },
      });
    } else {
      await response(res, tokenData);
    }
  } catch (e) {
    return exceptionEncountered(res);
  }
};
