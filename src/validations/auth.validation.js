import { Joi } from "express-validation";
const checkPhoneNumberRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;

export default {
  authenticate: {
    body: Joi.object({
      email: Joi.string().email(),
      phone_number: Joi.string().regex(checkPhoneNumberRegex).required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{5,30}/),
    }),
  },
  register: {
    body: Joi.object({
      phone_number: Joi.string().regex(checkPhoneNumberRegex).required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{5,30}/)
        .required(),
      code: Joi.string().required(),
    }),
  },
  login: {
    body: Joi.object({
      phone_number: Joi.string().regex(checkPhoneNumberRegex).required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{5,30}/)
        .required(),
    }),
  },
  checkUser: {
    body: Joi.object({
      phone_number: Joi.string().regex(checkPhoneNumberRegex).required(),
    }),
  },
  verification: {
    body: Joi.object({
      code: Joi.string().required(),
    }),
  },
  sendOtp: {
    body: Joi.any(),
  },
  logout: {
    body: Joi.any(),
  },
};
