import { Joi } from "express-validation";
const checkPhoneNumberRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;

export default {
  update: {
    body: Joi.object({
      id: Joi.number().required(),
      phone_number: Joi.string().regex(checkPhoneNumberRegex).required(),
      role: Joi.string().required(),
    }),
  },
  list: {
    body: Joi.object({
      type: Joi.string().required(),
    }),
  },
  search: {
    body: Joi.object({
      phone_number: Joi.string().required(),
    }),
  },
};
