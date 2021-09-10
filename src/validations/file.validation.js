import { Joi } from "express-validation";

export default {
  list: {
    query: Joi.object({
      type: Joi.string().valid("image", "video").optional(),
    }),
  },
  single: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  remove: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
