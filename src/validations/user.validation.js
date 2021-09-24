import { Joi } from "express-validation";
const checkPhoneNumberRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;

export default {
  update: {
    body: Joi.object({
      id: Joi.number().required(),
      full_name: Joi.string().optional(),
      phone_number: Joi.string().regex(checkPhoneNumberRegex).required(),
      role: Joi.string()
        .valid("owner", "admin", "author", "ordinary")
        .optional(),
      imageId: Joi.number().optional(),
    }),
  },
  list: {
    query: Joi.object({
      role: Joi.string()
        .valid("owner", "admin", "author", "ordinary", "all")
        .optional(),
    }),
  },
  search: {
    body: Joi.object({
      phone_number: Joi.string().required(),
    }),
  },
};
