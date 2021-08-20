import httpStatus from "http-status";
import db from "../../models/index.js";
import _ from "lodash";
import moment from "moment-timezone";
import { response } from "../../utils/response.js";

const Op = db.Sequelize.Op;
const models = db.models;
const AccessToken = models.accessToken;

export default async (req, res) => {
  try {
    const { token } = req.body;
    const tokenRecord = await AccessToken.findOne({ where: { token } });
    await AccessToken.destroy({
      where: {
        userId: tokenRecord["dataValues"]["userId"],
        [Op.or]: {
          token_expire: { [Op.lt]: new Date() },
          verified: false,
        },
      },
    });
    await AccessToken.update(
      {
        token_expire: moment().utc().format(),
      },
      { where: { token } }
    );
    return response(res, {
      name: "LOG_OUT",
      statusCode: httpStatus.OK,
      message: "logged out and token destroyed",
    });
  } catch (error) {
    return response(res, {
      statusCode: httpStatus.EXPECTATION_FAILED,
      name: "EXPECTATION_FAILED",
      message: "something went wrong",
    });
  }
};
