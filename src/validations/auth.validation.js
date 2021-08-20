import { Joi } from "express-validation";

export default {
  // POST /v1/auth/login
  authenticate: {
    body: Joi.object({
      email: Joi.string().email(),
      phone_number: Joi.string()
        .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .required(),
      // identity: Joi.string().required(),
      with_email: Joi.boolean().required(),
      // app: Joi.object().keys({
      //     platform: Joi.string().valid(['android', 'web', 'ios']),
      //     version: Joi.string(),
      // }).required(),
    }),
  },
  // POST /v1/auth/login
  verification: {
    body: Joi.object({
      token: Joi.string().required(),
      code: Joi.string().required(),
    }),
  },
  retry: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
  logout: {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
};
